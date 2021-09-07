import Vue from 'vue';
import '../scss/element-variables.scss';
import {
  Button,
  Row,
  Col,
  ButtonGroup,
  Carousel,
  CarouselItem,
  Divider,
  Link,
  Form,
  FormItem,
  Input,
  Message, Card, Tag, Table, TableColumn, Tabs, TabPane,
} from 'element-ui'

Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(ButtonGroup);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Divider);
Vue.use(Link);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Card);
Vue.use(Tag);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tabs);
Vue.use(TabPane);

Vue.prototype.$message = Message;