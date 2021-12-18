import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NbCalendarRange, NbDateService, NbThemeService, NbWindowService} from '@nebular/theme';
import {SolarData} from '../../@core/data/solar';
import { DayCellComponent } from '../extra-components/calendar/day-cell/day-cell.component';
import { DatePipe } from '@angular/common';
import { takeWhile } from 'rxjs/operators';
import { ContactsService } from '../../../services/statistic.service';
import { QuestionCategoriesService } from '../../../services/question-categories.service';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
  amount: number;
}

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss'],
})
export class ECommerceComponent implements OnInit {
  date: any;
  date2: any;
  range: NbCalendarRange<Date>;
  dayCellComponent = DayCellComponent;
  @Input() on = true;
  alive = true;
  limit: 6;
  questionCategories: any;
  dataEcharts: any;
  dataEchartsOption: any;
  dataBar: any;
  dataBarOption: any;

  lightCard: CardSettings = {
    title: 'TIN CHO THUÊ',
    iconClass: 'nb-home',
    type: 'primary',
    amount: 0,
  };
  rollerShadesCard: CardSettings = {
    title: 'HOÁ ĐƠN',
    iconClass: 'nb-compose',
    type: 'success',
    amount: 0,
  };
  wirelessAudioCard: CardSettings = {
    title: 'BÌNH LUẬN',
    iconClass: 'nb-list',
    type: 'info',
    amount: 0,
  };
  coffeeMakerCard: CardSettings = {
    title: 'NGƯỜI DÙNG',
    iconClass: 'nb-person',
    type: 'warning',
    amount: 0,
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];
  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
  };

  public progressInfoData = [];

  optionsCircle: any = {};
  options: any = {};
  themeSubscription: any;
  time: 'all';

  constructor(private contactsService: ContactsService,
              private themeService: NbThemeService,
              private solarService: SolarData,
              protected dateService: NbDateService<Date>,
              private windowService: NbWindowService,
              public datepipe: DatePipe,
              private questionCategoriesService: QuestionCategoriesService) {
    this.range = {
      start: this.dateService.addDay(this.monthStart, 3),
      end: this.dateService.addDay(this.monthEnd, -3),
    };
  }

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }

  get monthEnd(): Date {
    return this.dateService.getMonthEnd(new Date());
  }

  openWindow(contentTemplate) {
    this.windowService.open(
      contentTemplate,
      {
        title: 'Tuỳ chọn khoảng thời gian',
      },
    );
  }

  getRangeDate(event) {
    if (event.start && event.end) {
      this.date = this.datepipe.transform(event.start, 'yyyy-MM-dd');
      this.date2 = this.datepipe.transform(event.end, 'yyyy-MM-dd');
      this.range = {
        start: this.dateService.addDay(this.monthStart, 3),
        end: this.dateService.addDay(this.monthEnd, -3),
      };
      this.getData();
    }
  }

  ngOnInit() {
    this.date = '';
    this.date2 = '';
    this.dataEcharts = [];
    this.dataEchartsOption = [];
    this.dataBar = [];
    this.dataBarOption = [];
    this.questionCategories = [];
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });
    this.getData();
  }

  getData() {
    this.contactsService.countRentalNews(this.date, this.date2).toPromise()
      .then((data) => {
        this.lightCard.amount = data['count'];
      });
    this.contactsService.countPremiumBill(this.date, this.date2).toPromise()
      .then((data) => {
        this.rollerShadesCard.amount = data['count'];
      });
    this.contactsService.countComment(this.date, this.date2).toPromise()
      .then((data) => {
        this.wirelessAudioCard.amount = data['count'];
      });
    this.contactsService.countCustomer(this.date, this.date2).toPromise()
      .then((data) => {
        this.coffeeMakerCard.amount = data['count'];
      });
    // this.contactsService.countQuestionByCategories(this.date, this.date2).toPromise()
    //   .then((data: any) => {
    //     this.dataEcharts = [];
    //     this.dataEchartsOption = [];
    //     if(data.length > 0) {
    //       for (let item of data) {
    //         this.dataEcharts.push(item.name);
    //       }
    //       this.dataEchartsOption = data;
    //       this.echart();
    //     }
    //   });
    // this.contactsService.countIncomeByDate(this.date, this.date2).toPromise()
    //   .then((data: any) => {
    //     console.log(data);
    //     this.dataBar = [];
    //     this.dataBarOption = [];
    //     if(data.length > 0){
    //       for (let item of data) {
    //         this.dataBar.push(this.datepipe.transform(item.date, 'yyyy-MM-dd'));
    //         this.dataBarOption.push(item.value);
    //       }
    //       this.bar();
    //     }
    //   });
  }

  // echart() {
  //   this.themeSubscription = this.themeService.getJsTheme().subscribe(config => {
  //     const colors = config.variables;
  //     const echarts: any = config.variables.echarts;
  //     this.optionsCircle = {
  //       backgroundColor: echarts.bg,
  //       color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
  //       tooltip: {
  //         trigger: 'item',
  //         formatter: '{a} <br/>{b} : {c} ({d}%)',
  //       },
  //       legend: {
  //         orient: 'vertical',
  //         left: 'left',
  //         data: this.dataEcharts,
  //         textStyle: {
  //           color: echarts.textColor,
  //         },
  //       },
  //       series: [
  //         {
  //           name: 'Thống kê hỏi đáp',
  //           type: 'pie',
  //           radius: '80%',
  //           center: ['50%', '50%'],
  //           data: this.dataEchartsOption,
  //           itemStyle: {
  //             emphasis: {
  //               shadowBlur: 10,
  //               shadowOffsetX: 0,
  //               shadowColor: echarts.itemHoverShadowColor,
  //             },
  //           },
  //           label: {
  //             normal: {
  //               textStyle: {
  //                 color: echarts.textColor,
  //               },
  //             },
  //           },
  //           labelLine: {
  //             normal: {
  //               lineStyle: {
  //                 color: echarts.axisLineColor,
  //               },
  //             },
  //           },
  //         },
  //       ],
  //     };
  //   });
  // }

  // bar() {
  //   this.themeSubscription = this.themeService.getJsTheme().subscribe(config => {
  //     const colors = config.variables;
  //     const echarts: any = config.variables.echarts;
  //     this.options = {
  //               backgroundColor: echarts.bg,
  //               color: [colors.primaryLight],
  //               tooltip: {
  //                 trigger: 'axis',
  //                 axisPointer: {
  //                   type: 'shadow',
  //                 },
  //               },
  //               grid: {
  //                 left: '3%',
  //                 right: '4%',
  //                 bottom: '3%',
  //                 containLabel: true,
  //               },
  //               xAxis: [
  //                 {
  //                   type: 'category',
  //                   data: this.dataBar,
  //                   axisTick: {
  //                     alignWithLabel: true,
  //                   },
  //                   axisLine: {
  //                     lineStyle: {
  //                       color: echarts.axisLineColor,
  //                     },
  //                   },
  //                   axisLabel: {
  //                     textStyle: {
  //                       color: echarts.textColor,
  //                     },
  //                   },
  //                 },
  //               ],
  //               yAxis: [
  //                 {
  //                   type: 'value',
  //                   axisLine: {
  //                     lineStyle: {
  //                       color: echarts.axisLineColor,
  //                     },
  //                   },
  //                   splitLine: {
  //                     lineStyle: {
  //                       color: echarts.splitLineColor,
  //                     },
  //                   },
  //                   axisLabel: {
  //                     textStyle: {
  //                       color: echarts.textColor,
  //                     },
  //                   },
  //                 },
  //               ],
  //               series: [
  //                 {
  //                   name: 'Score',
  //                   type: 'bar',
  //                   barWidth: '60%',
  //                   data: this.dataBarOption,
  //                 },
  //               ],
  //             };
  //   });
  // }

}
