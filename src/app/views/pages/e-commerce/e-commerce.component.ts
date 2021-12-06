import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ProgressInfo } from '../../@core/data/stats-progress-bar';
import { takeWhile } from 'rxjs/operators';
import { ContactsService } from '../../../services/statistic.service';
import {NbThemeService} from '@nebular/theme';
import {SolarData} from '../../@core/data/solar';

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
export class ECommerceComponent implements OnInit, OnDestroy {
  @Input() on = true;
  alive = true;

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
              private solarService: SolarData) {


  }
  ngOnInit() {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });
    this.getData(this.time);
  }
  getData(time){
    this.contactsService.countRentalNews(time).toPromise()
      .then((data) => {
        this.lightCard.amount = data['count'];
      });
    this.contactsService.countPremiumBill(time).toPromise()
      .then((data) => {
        this.rollerShadesCard.amount = data['count'];
      });
    this.contactsService.countComment(time).toPromise()
      .then((data) => {
        this.wirelessAudioCard.amount = data['count'];
      });
    this.contactsService.countCustomer(time).toPromise()
      .then((data) => {
        this.coffeeMakerCard.amount = data['count'];
      });
  }
  change(event){
    this.getData(event);
  }
  ngAfterViewInit() {
    this.themeSubscription = this.themeService.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;
      const bar = ['Thu 2', 'Thu 3', 'Thu 4', 'Thu 5', 'Thu 6', 'Thu 7', 'CN'];
      this.optionsCircle = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Kinh nghiệm thuê nhà', 'Tiện ích - Dịch vụ', 'Luật', 'Đầu tư', 'Review'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Thống kê hỏi đáp',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: 'Đầu tư' },
              { value: 310, name: 'Review' },
              { value: 234, name: 'Tiện ích - Dịch vụ' },
              { value: 135, name: 'Kinh nghiệm thuê nhà' },
              { value: 1548, name: 'Luật' },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: bar,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: 'Score',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220],
          },
        ],
      };
    });
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
