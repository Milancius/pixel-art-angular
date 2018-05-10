/**
 * Created by milan on 26.1.2017..
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw';

@Injectable()
export class ServerCommunication {

    /*******************************************
     *                                         *
     *            STATIC VARIABLES             *
     *                                         *
     *******************************************/

    static LOCAL_STORAGE_ARRAY: Array<string> = [];


    /*******************************************
     *                                         *
     *            PUBLIC VARIABLES             *
     *                                         *
     *******************************************/

    /**
     * @param {boolean} isJWT - If the server expects JWT token for auth this needs to be true. DEFAULT: false
     */
    public isJWT = false;

    /*******************************************
     *                                         *
     *           PRIVATE VARIABLES             *
     *                                         *
     *******************************************/

    private _localPath = '/assets/';
    // private _url: string = 'http://92.60.225.14:1337/api/D4Lik-nGOqoMKLufdEO6pugRmrHySR9wNLXl7ur8/';
    // private _url = 'http://192.168.224.117:3000/';
    private _url = 'http://92.60.225.14:1337/';

    constructor(private _http: HttpClient) {}

    // /*******************************************
    //  *                                         *
    //  *             STATIC METHODS              *
    //  *                                         *
    //  *******************************************/
    //
    // /**
    //  *
    //  * @returns {Object} - Returns either the response object if code 200 || 201 or returns an error object.
    //  * @static
    //  */
    // static _handleSuccess(res: HttpEvent<HttpResponse<Object>>, index: number): HttpEvent<any> {
    //   //Everything is OK return JSON;
    //   if (res.status === 200 || res.status === 201 || res.status === 202) {
    //     if (ServerCommunication.LOCAL_STORAGE_ARRAY.length !== 0) {
    //       const localStorageArray: Array<string> = ServerCommunication.LOCAL_STORAGE_ARRAY;
    //       if (localStorageArray[0].indexOf('jwt') !== -1) {
    //         const jwt_headers: Object = {};
    //         // console.log(res);
    //         res.headers.forEach((value, key) => {
    //           if (key.indexOf('jwt') !== -1) {
    //             jwt_headers[key] = value[0];
    //           }
    //         });
    //         // PandaService.setLocalStorage(localStorageArray, jwt_headers);
    //       }
    //       else {
    //         //PandaService.setLocalStorage(localStorageArray, res.json());
    //       }
    //     }
    //     return res.json();
    //   }
    //
    //   //Error with message
    //   else if (!!res.json() && !!res.json()['message']) {
    //     return { error: res.json()['message'] };
    //   }
    //
    //   //Error without message
    //   else {
    //     // console.log(res);
    //     return { error: 'Something went wrong, please try again later.' };
    //   }
    // }
    //
    // static _handleError(error: Response | any) {
    //   let errMsg: string;
    //   if (error instanceof Response) {
    //     const body = error.json() || '';
    //     const err = body['error'] || JSON.stringify(body);
    //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    //   } else {
    //     errMsg = error.message ? error.message : error.toString();
    //   }
    //   // console.log(error);
    //   // console.error(errMsg);
    //   return Observable.throw(errMsg);
    // }

    /*******************************************
     *                                         *
     *             PUBLIC METHODS              *
     *                                         *
     *******************************************/


    /**
     * GET REQUEST FROM NODE SERVER
     * @param {string} url - Url you're getting something from the node server, example: trainers/:id
     * @param {Object=} localStorageArray - Array of strings to be added to local storage(optional)
     * @returns {any} - Request map if code 200 || 201 or error otherwise
     */
    getServer(url: string, localStorageArray?: Array<string>): any {
        let headers: HttpHeaders;
        let options: Object;
        url = this._url + url;

        if (localStorageArray && localStorageArray.length !== 0) {
            ServerCommunication.LOCAL_STORAGE_ARRAY = localStorageArray.splice(0, localStorageArray.length);
        }
        else {
            //Garbage collection
            ServerCommunication.LOCAL_STORAGE_ARRAY = [];
        }

        if (this.isJWT === true) {
            ServerCommunication.LOCAL_STORAGE_ARRAY.push('jwt_access');
            ServerCommunication.LOCAL_STORAGE_ARRAY.push('jwt_refresh');
            //const jwt_object: Object = PandaService.getLocalStorage(['jwt_access', 'jwt_refresh']);
            headers = new HttpHeaders();
            headers.append('Content-Type', 'application/json');

            options = { headers: headers };

            return this._http.request(new HttpRequest('GET', url, options));
        }
        else {
            headers = new HttpHeaders({ 'Content-Type': 'application/json' });

            options = { headers: headers };

            return this._http.get(url);
        }
    }

    /**
     * DELETE REQUEST FROM NODE SERVER
     * @param {string} url - Url you're getting something from the node server, example: trainers/:id
     * @param data
     * @returns {any} - Request map if code 200 || 201 or error otherwise
     */
    deleteServer(url: string, data?: Object | null): any {
        let headers: HttpHeaders;
        let options: Object;
        url = this._url + url;

        if (this.isJWT === true) {
            ServerCommunication.LOCAL_STORAGE_ARRAY.push('jwt_access');
            ServerCommunication.LOCAL_STORAGE_ARRAY.push('jwt_refresh');
            //const jwt_object: Object = PandaService.getLocalStorage(['jwt_access', 'jwt_refresh']);
            headers = new HttpHeaders();
            headers.append('Content-Type', 'application/json');

            options = { headers: headers};

            return this._http.request(new HttpRequest('DELETE', url, data, options));
        }
        else {
            headers = new HttpHeaders({ 'Content-Type': 'application/json' });

            options = { headers: headers};

            return this._http.delete(url, options);
        }
    }

    /**
     * POST/PUT REQUEST TO NODE SERVER
     * @param {string} url - Url you're posting something to the node server, example: sign-up/1
     * @param {Object} data - Body you're posting
     * @param {string} method - Can be either "post" or "put". Default POST.
     * @param {Object=} localStorageArray - Array of strings to be added to local storage(optional)
     * @returns {any} Response object if code 200 || 201 or error otherwise
     */
    postServer(url: string, data: Object | null, method: string = 'post', localStorageArray?: Array<string>): any {
        let methodBool: string;
        let headers: HttpHeaders;
        let options: Object;
        url = this._url + url;

        if (localStorageArray && localStorageArray.length !== 0) {
            ServerCommunication.LOCAL_STORAGE_ARRAY = localStorageArray.splice(0, localStorageArray.length);
        }
        else {
            // Garbage collection
            ServerCommunication.LOCAL_STORAGE_ARRAY = [];
        }

        if (method.toLowerCase() === 'post') {
            methodBool = 'post';
        }
        else if (method.toLowerCase() === 'put') {
            methodBool = 'put';
        }
        else {
            return Observable.throw('Wrong request method, allowed methods: PUT || POST!');
        }

        if (this.isJWT === true) {
            //const jwt_object: Object = PandaService.getLocalStorage(['jwt_access', 'jwt_refresh']);
            headers = new HttpHeaders();
            headers.append('Content-Type', 'application/json');

            options = { headers: headers };

            return this._http[methodBool](url, data, options);
        }
        else {
            headers = new HttpHeaders({ 'Content-Type': 'application/json' });

            options = { headers: headers };
            // console.log(options);

            return this._http[methodBool](url, data, options);
        }
    }

    /**
     *
     * @param {string} path - Path to the local JSON file
     * @returns {Object} Response object if code 200 || 201 or error otherwise
     */
    getJSON(path: string) {
        return this._http.get(this._localPath + path);
    }
}
