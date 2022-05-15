import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router/index.js'
import {
  Button, Container, Radio, Aside, Main, Header, Menu, Submenu, MenuItemGroup,
  MenuItem, Dropdown, DropdownItem, DropdownMenu, Row, Col, Card, Table, TableColumn,
  Breadcrumb, BreadcrumbItem, Tag, Form, FormItem, Select, DatePicker, Option, Input,
  Dialog, Pagination, Timeline, TimelineItem, MessageBox, Message, Footer, Carousel,
  CarouselItem,Tabs,TabPane
} from 'element-ui'

Vue.config.productionTip = false

Vue.use(Button);
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Radio)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tag)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(DatePicker)
Vue.use(Option)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Footer)
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Tabs)
Vue.use(TabPane)

Vue.prototype.$message = Message;
Vue.prototype.$messageBox = MessageBox;
Vue.prototype.$baseImgUrl = 'http://localhost:9000/static/';

const vm = new Vue({
  store,
  router,
  render: h => h(App),
  mounted() {
  },
}).$mount('#app')

export default vm;
