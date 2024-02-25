from fastapi import Request
from fastapi.responses import RedirectResponse
from jose import JWTError, jwt
from starlette.middleware.base import BaseHTTPMiddleware

from core.config import get_jwt_token, get_settings

settings = get_settings()

NO_AUTH_REQUIRED = ["/api/auth/login", "/api/auth/signup"]


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
            if [
                str(request.url.path).endswith(no_auth) for no_auth in NO_AUTH_REQUIRED
            ].count(True) > 0:
                response = await call_next(request)
            else:
                response = RedirectResponse(url="/login")
        return response
