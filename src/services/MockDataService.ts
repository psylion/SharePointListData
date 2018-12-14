import { ISPList } from '../interfaces/ISPList';
import { ISPDataService } from '../interfaces/ISPDataService';
import { ISPListItem } from '../interfaces/ISPListItem';
export default class MockDataService implements ISPDataService {
    public getLists(): Promise<ISPList[]> {
        var mockData: ISPList[] = [
            { id: "1", name: "Announcements" },
            { id: "2", name: "Calendar" }
        ];
        return Promise.resolve(mockData);
    }
    public getListItems(ListID: string, MaxItems: number): Promise<ISPListItem[]> {
        var mockData: ISPListItem[] = [];
        for (let i = 0, max = MaxItems; i < max; i += 1) {
            mockData.push({ id: i, title: "Item" + i });
        }
        return Promise.resolve(mockData);
    }
}