import Vue from 'vue';
import '../scss/element-variables.scss';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
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
  Message,
  Card, 
  Tag, 
  Table, 
  TableColumn, 
  Tabs, 
  TabPane, 
  Drawer,
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
Vue.use(Drawer);
Vue.component(CollapseTransition.name, CollapseTransition);

Vue.prototype.$message = Message;