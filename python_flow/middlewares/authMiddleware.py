from fastapi import HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/login") or request.url.path.startswith("/public"):
            # Allow login & public endpoints without auth
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing Authorization header")

        token = auth_header.split(" ")[1]
        username = verify_token(token)

        # Attach user info to request.state for later use
        request.state.user = username

        response = await call_next(request)
        return response