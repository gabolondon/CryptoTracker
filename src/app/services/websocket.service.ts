import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { LiveInfo } from '../models/Liveinfo.interface';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: WebSocket;
  isConnected: boolean = false;

  constructor() {}

  public connect(initSymbols: string[]): Observable<LiveInfo> {
    this.socket = new WebSocket('wss://ws.coinapi.io/v1/');
    return new Observable((observer) => {
      this.socket.onopen = () => {
        observer.next({ uuid: 'ws connection established' } as LiveInfo);
        this.isConnected = true;
        this.sendMessage(initSymbols);
      };
      this.socket.onmessage = (event) => observer.next(JSON.parse(event.data));
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = () => observer.complete();
    });
  }

  sendMessage(message: string[]): void {
    const handShakeMessage = {
      type: 'hello',
      apikey: environment.API_KEY,
      heartbeat: false,
      subscribe_data_type: ['trade'],
      subscribe_filter_symbol_id: message,
    };
    this.socket.send(JSON.stringify(handShakeMessage));
  }

  closeConnection(): void {
    this.socket.close();
  }
}
