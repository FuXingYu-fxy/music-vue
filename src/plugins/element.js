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
  Message,
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

Vue.prototype.$message = Message;