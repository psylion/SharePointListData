import { ISPList } from './ISPList';
import { ISPListItem } from './ISPListItem';
export interface ISPDataService {
    getLists():Promise<ISPList[]>;
    getListItems(ListID:string, MaxItems:number):Promise<ISPListItem[]>;
}