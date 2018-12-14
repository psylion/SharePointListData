import { ISPList } from '../interfaces/ISPList';
import {ISPListItem} from '../interfaces/ISPListItem';
import { ISPDataService } from '../interfaces/ISPDataService';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import {
    SPHttpClient,
    SPHttpClientResponse
} from '@microsoft/sp-http';
export default class SharePointDataService implements ISPDataService {
    constructor(public context: IWebPartContext) { }
    public getLists(): Promise<ISPList[]> {
        let requestUrl: string = this.context.pageContext.web.absoluteUrl +
            //'/_api/web/lists?$filter=hidden eq false and BaseType eq 0&$select=id,title';
            '/_api/web/lists?$filter=hidden eq false&$select=id,title';
        return this.context.spHttpClient
            .get(requestUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => response.json())
            .then((jsonData: any) => {
                return jsonData.value.map((element) => {
                    return { id: element.Id, name: element.Title };
                });
            })
            .catch((error) => {
                console.log("Something went wrong!");
                console.log(error);
                return [];
            });
    }
    public getListItems(ListID: string, MaxItems: number): Promise<ISPListItem[]> {
        let requestUrl: string = this.context.pageContext.web.absoluteUrl +
            "/_api/web/lists(guid'" + ListID + "')/items/?$top=" + MaxItems + "&$select=id,Title";
        return this.context.spHttpClient
            .get(requestUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => response.json())
            .then((jsonData: any) => {
                return jsonData.value.map((element) => {
                    return { id: element.Id, title: element.Title };
                });
            })
            .catch((error) => {
                console.log("Something went wrong!");
                console.log(error);
                return [];
            });
    }
}