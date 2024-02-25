from fastapi import Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from jose import JWTError, jwt
from starlette.middleware.base import BaseHTTPMiddleware

from core.config import get_jwt_token, get_settings

settings = get_settings()

NO_AUTH_REQUIRED = ["/api/login", "/api/docs", "/api/signup"]


class UnauthenticatedRequest(Exception):
    pass


class CheckAuthentication(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # we expect JWT token in cookie (same origin)
        auth_token: str | None = request.cookies.get("access_token", None)
        try:
            if auth_token:
                # Check validity of the JWT token
                payload = jwt.decode(
                    auth_token,
                    get_jwt_token(),
                    settings.algorithm,
                )
                if payload is None:
                    # The token is invalid, the user is not authenticated.
                    raise UnauthenticatedRequest()
                request.state.user = payload["sub"]
                print(payload)
                response = await call_next(request)
            else:
                raise UnauthenticatedRequest()
        except (UnauthenticatedRequest, JWTError):
            # If it's a login request, allow it to pass through middleware
            if request.url.path in NO_AUTH_REQUIRED:
                # For docs, we want to populate FastAPI host with a JWT
                if request.url.path == "/api/docs":
                    response = RedirectResponse("/api/login?reqFrom=docs")
                else:
                    response = await call_next(request)
            else:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={
                        "message": "Unauthenticated request",
                    },
                )
        return response
