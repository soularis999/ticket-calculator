import { Component, OnInit, Input } from '@angular/core';

import { split } from 'lodash';

import { ApiProxyService } from '../api-proxy.service';
import { Request } from '../domain/domains';
import { calculateSkipDates } from '../util/utils';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  @Input() options = [];
  @Input() selectedGroup: string;
  @Input() roundTrip: boolean;
  @Input() date: string;

  private apiProxy: ApiProxyService;

  constructor(apiProxy: ApiProxyService) {
    this.apiProxy = apiProxy;
    this.date = this.getDate();
  }

  ngOnInit() {
    this.roundTrip = this.apiProxy.loadRoundTripFlag();
    this.apiProxy.loadGroups()
      .subscribe(groups => {
        console.log(groups);
        this.options = groups.slice(0, groups.length);
        this.options.forEach(option => {
          if (option.isSelected) {
            this.selectedGroup = option.group;
          }
        });
      });
  }

  onSubmit = (form) => {
    if (form.invalid) {
      return;
    }
    try {
      console.log('Form', form.value);
      const monthYear = this.parseDate(form.value.date);
      const skipDates = calculateSkipDates(form.value.skipDate);
      this.validateSkipDates(monthYear[0], monthYear[1], skipDates);

      const req = {
        group: form.value.group,
        month: monthYear[0],
        year: monthYear[1],
        skip: skipDates,
        isRoundTrip: form.value.roundTrip
      } as Request;

      console.log(req);
      this.apiProxy.search(req);

    } catch (e) {
      console.log(e);
    }
  }

  getDate = () => {
    const today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    if (6 < today.getDate()) {
      month += 1;
    }
    if (12 < month) {
      month = 1;
      year += 1;
    }
    return `${month}/${year}`;
  }

  parseDate = (date: string): number[] => {
    const monthAndYear = split(date, '/');
    if (2 !== monthAndYear.length) {
      throw new Error(`Month and year is not in correct format (MM/YYYY) ${date}`);
    }

    const month = parseInt(monthAndYear[0]);
    const year = parseInt(monthAndYear[1]);
    if (month < 1 || 12 < month) {
      throw new Error(`Month is out of range ${month}`);
    }
    return [month, year];
  }

  validateSkipDates = (month: number, year: number, skipDays: number[]): void => {
    const d = new Date(year, month, 0);
    skipDays.forEach(date => {
      if (date <= 0 || date > d.getDate()) {
        throw new Error(`Skipped date ${date} is outside allowed for ${d.getMonth() + '/' + d.getFullYear()}. Last day is ${d.getDate()}`);
      }
    });
  }
}
