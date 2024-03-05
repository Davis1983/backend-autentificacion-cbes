import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
//import { RequestRoute } from 'src/shared/dtos/request-route.dto';
/*import { AuthService } from '../auth/auth.service';*/
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean|Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let method;
    let route;
    method = request['method'];
    route = request['route']['path'];
    console.log('REQUEST: ', 'metodo: ' + method +' ruta: '+ route);
    //
    if(request['headers']['token'] != undefined) {
        let token = request['headers']['token'].replace('Bearer ', '');
        return new Observable<boolean>((subscriber) => {
          this.authService.verifyTokenForGuard(token).pipe(map(item => {
            //console.log(item, token);
            //console.log (item['data']['idcNivel']);
            if(item['data']['idcNivel'] =='NACIONAL'){
              return (1);
            }else{
              return (0);
            } 
          }), 
          /*mergeMap(role => {
            console.log('ROLE',role);
            if(role == '1') {
              return of(1);
            } else {
              GetPermissions devuelve 1 o 0
              //return this.authService.getPermissions(role, rr);
            }
            
          }),*/
          tap(console.log)
        )
        .subscribe(response  => {
          console.log('RESPONSE',response);
          if(response >0) {
            subscriber.next(true);
            subscriber.complete();
          } else {
            subscriber.error(new UnauthorizedException('Acceso no autorizado.'));
            subscriber.complete();
          }
        }, error => {
          subscriber.error(new UnauthorizedException('Jwt expired.'));
          subscriber.complete();
        });
      });
  } else {
      return false;
  }
}
}