let menu = {
    state: {
        menuList: [
            {
                path: "/home",
                name: "Home",
                label: "首页",
                style: "menu-item",
            },
            {
                path: "/recommand",
                name: "Recommand",
                label: "电影推荐",
                style: "menu-item",
            },
            {
                path: "/category",
                name: "Category",
                label: "分类",
                style: "menu-item",
            },
        ],
    },
    mutations: {
        setMenuStyle(state, name) {
            state.menuList.forEach(element => {
                if(element.name === name) element.style = 'menu-item-active';
                else element.style = 'menu-item';
            });
        }
    }
}

export default menu;