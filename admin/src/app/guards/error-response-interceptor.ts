import { HttpErrorResponse,HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const ErrorResponseInterceptor:HttpInterceptorFn=(req,next)=>
    next(req).pipe(catchError(handleErrorResponse))

function handleErrorResponse(error:HttpErrorResponse){
    console.log('intercept')
    const errorResponse=`Error status Interceptor:':${error.status},message:${error.message}`
    return throwError(()=>errorResponse)
}
 