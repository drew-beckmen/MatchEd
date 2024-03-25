from fastapi import Request, status
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from starlette.middleware.base import BaseHTTPMiddleware

from core.config import get_jwt_token, get_settings

settings = get_settings()

NO_AUTH_REQUIRED = ["/api/auth/login", "/api/auth/signup", "/api/public/participants", "/api/public/conditions"]


class UnauthenticatedRequest(Exception):
    pass


class CheckAuthentication(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # We expect JWT in cookie or header
        auth_token: str | None = request.cookies.get("access_token", None)
        if not auth_token:
            auth_token = request.headers.get("Authorization", None)
            if auth_token:
                auth_token = auth_token.split(" ")[1]
        print("AUTH TOKEN", auth_token)
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
                response = await call_next(request)
            else:
                raise UnauthenticatedRequest()
        except (UnauthenticatedRequest, JWTError):
            # If it's a login request, allow it to pass through middleware
            print([
                no_auth in str(request.url.path) for no_auth in NO_AUTH_REQUIRED
            ])
            if [
                no_auth in str(request.url.path) for no_auth in NO_AUTH_REQUIRED
            ].count(True) > 0:
                response = await call_next(request)
            else:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={
                        "message": "Unauthenticated request",
                    },
                )
        return response
