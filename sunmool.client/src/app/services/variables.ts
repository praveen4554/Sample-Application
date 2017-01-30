import { Injectable } from '@angular/core';

@Injectable()
export class VariableService {
  public apiServerAdress = 'http://backend.sunmool.co' ;
}

export const VARIABLE_SERVICE_PROVIDER = [
  VariableService
];
