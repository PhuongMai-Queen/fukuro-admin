import { Injectable, OnInit } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { ProgressInfo, StatsProgressBarData } from '../data/stats-progress-bar';

@Injectable()
export class StatsProgressBarService extends StatsProgressBarData implements OnInit {

  private progressInfoData: ProgressInfo[] = [
    {
      title: 'Thu nhập hôm nay',
      value: 572900,
      activeProgress: 70,
      description: 'Better than last week (70%)',
    },
    {
      title: 'Hoá đơn mới',
      value: 6000,
      activeProgress: 30,
      description: 'Better than last week (30%)',
    },
    {
      title: 'Bình luận mới',
      value: 200,
      activeProgress: 55,
      description: 'Better than last week (55%)',
    },
  ];

  ngOnInit(): void {

  }

  getProgressInfoData(): Observable<ProgressInfo[]> {
    return observableOf(this.progressInfoData);
  }
}
