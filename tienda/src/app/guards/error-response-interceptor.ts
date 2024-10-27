/*
import { HttpErrorResponse,HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const ErrorResponseInterceptor:HttpInterceptorFn=(req,next)=>
    next(req).pipe(catchError(handleErrorResponse))

function handleErrorResponse(error:HttpErrorResponse){
    console.log('interceptor')
    const errorResponse=`Error status Interceptor:':${error.status},message:${error.message}`
    return throwError(()=>errorResponse)
}
 */
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const ErrorResponseInterceptor: HttpInterceptorFn = (req, next) => 
    next(req).pipe(catchError((error: HttpErrorResponse) => handleErrorResponse(error)));

function handleErrorResponse(error: HttpErrorResponse) {
    console.log('Interceptor detectó un error',error);

    // Error 403 (acceso no autorizado o token inválido)
    if (error.status === 403) {
        console.log('Token inválido o acceso no autorizado');
        
        // Limpiar el token del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        
        // Redirigir al usuario a la página de login
        window.location.href = '/login';
    }

    const errorResponse = `Error status Interceptor: ${error.status}, message: ${error.message}`;
    return throwError(() => errorResponse);
}
