import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneSlider,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ListDataWebPart.module.scss';
import * as strings from 'ListDataWebPartStrings';

import { ISPList } from '../../interfaces/ISPList';
import { ISPListItem } from '../../interfaces/ISPListItem';

import { ISPDataService } from '../../interfaces/ISPDataService';
import MockDataService from '../../services/MockDataService';
// for Environment test
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import SharePointDataService from '../../services/SharePointDataService';

export interface IListDataWebPartProps {
  ListID: string;
  MaxItems: number;
}

export default class ListDataWebPart extends BaseClientSideWebPart<IListDataWebPartProps> {
  private _dataService: ISPDataService;
  private get DataService(): ISPDataService {
    if (!this._dataService) {
      if (Environment.type in [
        EnvironmentType.Local,
        EnvironmentType.Test
      ]) {
        this._dataService = new MockDataService();
      } else {
        this._dataService = new SharePointDataService(this.context);
      }
    }
    return this._dataService;
  }
  private _listDropDownOptions: IPropertyPaneDropdownOption[] = [];
  protected onInit(): Promise<void> {
    this.getLists()
      .then((listData) => {
        this._listDropDownOptions = this.getListDropdownOptions(listData);
      });
    return Promise.resolve<void>();
  }
  private getLists(): Promise<ISPList[]> {
    return this.DataService.getLists();
  }
  private loadListItems() {
    this.DataService
      .getListItems(this.properties.ListID, this.properties.MaxItems)
      .then((listItemData: ISPListItem[]) => {
        this.renderListItems(listItemData);
      });
  }
  private renderListItems(listItemData: ISPListItem[]) {
    var html: string = '';
    listItemData.forEach((item: ISPListItem) => {
      html += `<div class="${styles.listItem}">
        <span class="ms-font-l">${item.id}</span>
        &nbsp;-&nbsp;
        <span class="ms-font-l">${item.title}</span>
        </div>`;
    });
    const listContainer: Element =
      this.domElement.querySelector('#spListItemContainer');
    listContainer.innerHTML = html;
  }
  private getListDropdownOptions(listData: ISPList[]): IPropertyPaneDropdownOption[] {
    var ddOptions: IPropertyPaneDropdownOption[] = [];
    listData.forEach((value) => {
      ddOptions.push({ key: value.id, text: value.name })
    });
    return ddOptions;
  }
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.listData}">
        <div class="${ styles.container}">
        <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
        <span class="ms-font-xl ms-fontColor-white">Items in your list:</span>
        <div id="spListItemContainer"></div>
        </div>
      </div>`;
    this.loadListItems();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this.loadListItems();
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: { description: strings.PropertyPaneListName },
        groups: [{
          groupName: strings.ListGroupName,
          groupFields: [
            PropertyPaneDropdown('ListID', {
              label: strings.ListNamePropertyLabel,
              options: this._listDropDownOptions
            }),
            PropertyPaneSlider('MaxItems', {
              label: strings.MaxItemsPropertyLabel,
              min: 0,
              max: 20
            })]
        }]
      }]
    };
  }
}
