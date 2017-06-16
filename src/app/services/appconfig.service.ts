import { Injectable } from '@angular/core';

@Injectable()
export class AppconfigService {
public AppName = 'ARES Explorer';
public AppIcon = 'assets:productplaceholder';
// public serviceUrl = 'http://extern2.iges.de/PubmedService/api/'; // Prod server
public serviceUrl = 'http://localhost:58481/api/';

  constructor() { }

}
