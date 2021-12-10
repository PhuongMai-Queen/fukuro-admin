import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Tổng Quan',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'RENTAL',
    group: true,
  },
  {
    title: 'Tin Cho Thuê',
    icon: 'tv-outline',
    children: [
      {
        title: 'Danh sách',
        link: '/pages/rental-news/list',
      },
    ],
  },
  {
    title: 'Chuyên Mục',
    icon: 'keypad-outline',
    children: [
      {
        title: 'Danh sách',
        link: '/pages/question-categories/list',
      },
      {
        title: 'Thêm mới',
        link: '/pages/question-categories/create',
      },
    ],
  },
  {
    title: 'PREMIUM',
    group: true,
  },
  {
    title: 'Khuyến Mãi',
    icon: 'gift-outline',
    children: [
      {
        title: 'Danh sách',
        link: '/pages/promotions/list',
      },
      {
        title: 'Thêm mới',
        link: '/pages/promotions/create',
      },
    ],
  },
  {
    title: 'Gói Premiums',
    icon: 'loader-outline',
    children: [
      {
        title: 'Danh sách',
        link: '/pages/premiums/list',
      },
      {
        title: 'Thêm mới',
        link: '/pages/premiums/create',
      },
    ],
  },
  {
    title: 'Hoá Đơn',
    icon: 'calendar-outline',
    children: [
      {
        title: 'Danh sách',
        link: '/pages/premium-bills/list',
      },
    ],
  },
  {
    title: 'CONTACT',
    group: true,
  },
  {
    title: 'Liên Hệ',
    icon: 'email-outline',
    children: [
      {
        title: 'Danh sách',
        link: '/pages/contacts/list',
      },
    ],
  },
  {
    title: 'BLOGS',
    group: true,
  },
  {
    title: 'Loại Bài Viết',
    icon: 'grid-outline',
    children: [
      {
        title: 'Danh sách',
        link: '/pages/blog-categories/list',
      },
      {
        title: 'Thêm mới',
        link: '/pages/blog-categories/create',
      },
    ],
  },
  {
    title: 'Bài Viết',
    icon: 'book-outline',
    children: [
      {
        title: 'Danh sách',
        link: '/pages/blogs/list',
      },
      {
        title: 'Thêm mới',
        link: '/pages/blogs/create',
      },
    ],
  },
  {
    title: 'USERS',
    group: true,
  },
  {
    title: 'Khách Hàng',
    icon: 'person-outline',
    children: [
      {
        title: 'Danh sách',
        link: '/pages/customers/list',
      },
      {
        title: 'Thêm mới',
        link: '/pages/customers/create',
      },
    ],
  },
  {
    title: 'Người Quản Trị',
    icon: 'person-done-outline',
    children: [
      {
        title: 'Danh sách',
        link: '/pages/admins/list',
      },
      {
        title: 'Thêm mới',
        link: '/pages/admins/create',
      },
    ],
  },
];
