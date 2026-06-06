from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


async def generic_exception_handler(
    request: Request,
    exc: Exception
): #generic exception handler for unhandled exceptions
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "message": str(exc),
                "type": "InternalServerError"
            }
        }
    )

async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
): #exception handler for request validation errors
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "message": "Validation Error",
                "details": exc.errors()
            }
        }
    )