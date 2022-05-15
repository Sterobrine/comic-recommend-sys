import Vue from 'vue';
import Router from 'vue-router';
import MainFrame from '../components/MainFrame';
import Home from '../views/home';
import Popular from '../views/recommand'
import Category from '../views/category'
import CommonMovieInfo from '../components/CommonMovieInfo'
import CommonMovieDetail from '../components/CommonMovieDetail'
import Personal from '../views/personal'
import SubscribeList from '../views/subscribelist'
import Tags from '../views/tags'
import Login from '../views/login'
import CommonLogin from '../components/CommonLogin'
import CommonRegist from '../components/CommonRegist'
import loginApi from '../../api/login'
import Comments from '../views/comments'
import Search from '../views/search'

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'MainFrame',
        redirect: '/home',
        component: MainFrame,
        children: [
            {
                path: '/home',
                name: 'Home',
                component: Home
            },
            {
                path: '/recommand',
                name: 'Recommand',
                component: Popular
            },
            {
                path: '/category',
                name: 'Category',
                component: Category
            },
            {
                path: '/search/:keyword',
                name: 'Search',
                component: Search
            },
            {
                path: '/movieinfo/:mid',
                name: 'CommonMovieInfo',
                component: CommonMovieInfo,
                redirect:'/movieinfo/:mid/detail',
                children: [
                    {
                        path: '/movieinfo/:mid/detail',
                        name: 'CommonMovieDetail',
                        component: CommonMovieDetail,
                    },
                    {
                        path: '/movieinfo/:mid/comments',
                        name: 'Comments',
                        component: Comments,
                    }
                ]
            },
            {
                path: '/personal',
                name: 'Personal',
                component: Personal,
                redirect:'/personal/subscribe',
                beforeEnter: (to, from, next) => {
                    loginApi.loginCheck().then(res => {
                        if(res.data.code===401){
                            next({name:'Login'});
                        }
                        else next();
                    });
                },
                children: [
                    {
                        path: '/personal/subscribe',
                        name: 'SubscribeList',
                        component: SubscribeList,
                    },
                    {
                        path: '/personal/tags',
                        name: 'Tags',
                        component: Tags,
                    }
                ]
            }
        ]
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        redirect: "/login/login",
        children: [
            {
                path: '/login/login',
                name: 'CommonLogin',
                component: CommonLogin
            },
            {
                path: '/login/regist',
                name: 'CommonRegist',
                component: CommonRegist
            }
        ]
    }
];

const router = new Router({
    routes,
    scrollBehavior(to,from,savedPosition){
        return {x:0,y:0}
    }
});


router.beforeEach((to, from, next) => {
    if (to.name === "CommonLogin" || to.name === "CommonRegist") {
        loginApi.loginCheck().then(res => {
            if (res.data.code === 200) router.push({ name: "Home" });
            else next();
        });
    }
    else next();
});


export default router;