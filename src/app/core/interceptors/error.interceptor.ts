import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocurrió un error inesperado';

      if (error.status === 0) {
        message = 'Sin conexión con el servidor. Verifica que el api esté corriendo.';
      } else if (error.status === 404) {
        message = error.error?.message ?? 'Recurso no encontrado';
      } else if (error.status === 400) {
        message = error.error?.message ?? 'Solicitud inválida';
      } else if (error.status >= 500) {
        message = 'Error en el servidor. Intenta más tarde.';
      }

      snackBar.open(message, 'Cerrar', {
        duration: 4000,
        panelClass: ['snackbar-error']
      });

      return throwError(() => error);
    })
  );
};
