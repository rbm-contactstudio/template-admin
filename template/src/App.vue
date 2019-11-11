<template>
  <div id="cs-app">
    <div class="cs-app">
      <cs-header></cs-header>
      <cs-alert></cs-alert>
      <section v-if="getCsState && (getCsState.permissions || getCsState.typeUser === 'DONO')">
        <div :class="{'cs-menu-list': windowWidth > 1200, 'cs-menu-list-float': windowWidth <= 1200}" :style="styleMenuShow">
          <cs-menu :items="menulist"></cs-menu>
        </div>
        <div :class="{'cs-content': getShowMenuFloat && windowWidth > 768, 'cs-content-full': !getShowMenuFloat || windowWidth < 768}">
          <router-view></router-view>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { CsMenu, CsHeader, CsAlert } from '@contactstudio/admin-tools';

  export default {
    components: {
      CsMenu,
      CsHeader,
      CsAlert
    },
    data(){
      return {
        windowWidth: null,
        showMenu: false
      }
    },
    created(){
      this['set-session'](this.getSession());
      setTimeout(() => {
        this.showMenu = true
      }, 1000)
    },
    mounted(){
      let me = this;
      this['get-user']().then(ret => {
        me['set-theme'](ret.theme);
      });
      this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth);
        this.getWindowWidth();
      })
    },
    computed: Object.assign({},
      mapGetters('lib', ['getCsState', 'getShowMenuFloat']),
      {
        menulist(){
          return [
            {text: 'Menu', route: '/menu', perm: '', state: this.getCsState}
          ]
        },
        styleMenuShow(){
          return this.getShowMenuFloat || this.windowWidth > 1200 ? {left: '0px'} : {left: '-230px'};
        },
        classContent(){
          return !this.getShowMenuFloat || this.windowWidth < 1200 ? 'cs-content-full' : 'cs-content';
        }
      }
    ),
    methods: Object.assign({},
      mapActions('lib/', [
        'set-session', 'get-user', 'set-theme', 'change-alert'
      ]),
      {
        getWindowWidth(){
          this.windowWidth = document.documentElement.clientWidth;
        },
        getQueryString(){
          let result = {};
          if(location.search.length > 0){
            let pairs = (location.search).slice(1).split('&');
            for(let idx in pairs){
              let pair = pairs[idx].split('=');
              if(pair[0]){
                result[pair[0].toLowerCase()] = decodeURIComponent(pair[1] || '');
              }
            }
          }
          return result;
        },
        getCookies(){
          let cookies = document.cookie;
          if (cookies) {
            cookies = cookies.replace(/;[ ]/gi, '","');
            cookies = '{"' + cookies.replace(/=/gi, '":"') + '"}';
            return JSON.parse(cookies);
          }
          return {};
        },
        getSession(){
          let allQueryString = this.getQueryString();
          let allCookies = this.getCookies();
          return allQueryString['cssession'] ? allQueryString['cssession'] : allCookies['cssession'];
        }
      }
    )
  }
</script>

<style lang="scss">
  $colorBase: #4b4b4b;
  $colorBaseLight: lighten($colorBase, 8%);
  $colorMenu: #38B6B1;
  $colorMenuHover: #296360;
  $colorMenuBorder: #CCCCCC;
  $colorDisabled: #999999;
  $colorError: #a94442;
  $colorSuccess: #17a918;
  $colorWhite: #FFFFFF;

  /*DEFAULT*/

  html, body{
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    padding-top: 50px;
  }
  #cs-app, .cs-app{
    height: 100%;
  }
  .material-icons.grid{
    font-size: 1.5rem;
  }
  .cs-header{
    background: $colorBaseLight;
    color: $colorWhite;
    .cs-menu-crumb{
      float: left;
      margin: 30px 0 0 10px;
      .cs-menu-breadcrumb{
        color: $colorWhite;
      }
      span{
        color: $colorMenuBorder;
      }
    }
    .cs-navbar{
      background: $colorBaseLight;
      border-color: $colorBase;
      .cs-logo{
        background: $colorBase;
        float: left;
        height: 50px;
        .cs-image-logo{
          height: 50px;
          width: 230px;
          background: transparent url('/dist/assets/logoCS.png') center center no-repeat;
          background-size: auto 87%;
        }
        .nav{
          .cs-menu-item a{
            color: $colorWhite;
            padding: 15px 15px 5px 15px;
          }
        }
      }
      .icons{
        float: right;
        .cs-icon-link{
          color: $colorWhite;
          &:hover{
            background: rgba(0, 0, 0, .1);
          }
          .cs-label-icon{
            position: absolute;
            top: 7px;
            right: 8px;
            padding: 2px 4px;
          }
        }
        .cs-user-image{
          float: left;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 10px;
          margin-top: -6px;
          background: $colorWhite;
        }
        .nav{
          .cs-notifications-menu a{
            padding: 15px 15px 5px 15px;
          }
          .dropdown-menu{
            background-color: $colorDisabled;
            width: 230px;
            padding: 10px;
          }
          .open a{
            background-color: rgba(0, 0, 0, .4);
            border: none;
          }
        }
      }
      .icons:after{
        clear: both;
      }
    }
  }

  section{
    height: 100%;
    .cs-menu-list{
      display: inline-block;
      width: 230px;
      height: 100%;
      vertical-align: top;
      background: $colorMenu;
      position: fixed;
    }
    .cs-menu-list-float{
      display: inline-block;
      width: 230px;
      height: 100%;
      z-index: 20;
      vertical-align: top;
      background: $colorMenu;
      position: absolute;
    }
    .cs-box-menu{
      //padding-top: 10px;
      border-top: 2px solid $colorMenuBorder;
      .disabled{
        color: $colorDisabled;
        opacity: .3;
        cursor: not-allowed;
      }
      .cs-list-menu{
        display: block;
        padding: 10px;
        border-bottom: 1px solid $colorMenuBorder;
        text-decoration: none;
        color: $colorWhite;
        background: rgba(0, 0, 0,.1);
        &:last-child{
          border-bottom: none;
        }
        &:hover{
          background: $colorMenuHover;
          color: $colorWhite;
          text-decoration: none;
        }
      }
      .router-link-active{
        color: $colorWhite;
        background: $colorBase;
      }
    }
    .cs-content{
      position: absolute;
      left: 235px;
      display: inline-block;
      width: calc(100% - 239px);
      vertical-align: top;
    }
    .cs-content-full{
      left: 235px;
      display: inline-block;
      width: 100%;
      position: static;
      vertical-align: top;
    }
  }

  .cs-btn-floating {
    position: fixed;
    bottom: 15px;
    right: 15px;
    display: inline-block;
    overflow: hidden;
    z-index: 1;
    width: 40px;
    height: 40px;
    line-height: 40px;
    padding: 0;
    border-radius: 50%;
    -webkit-transition: .3s;
    transition: .3s;
    cursor: pointer;
    vertical-align: middle;
    text-align: center;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
    background: $colorMenuHover;
  }
  .cs-btn-floating.btn-large {
    width: 56px;
    height: 56px;
    line-height: 54px;
  }
  .cs-btn-floating.btn-large i {
    line-height: 56px;
  }
  .cs-btn-floating i {
    width: inherit;
    display: inline-block;
    text-align: center;
    color: $colorWhite;
    line-height: 40px;
  }
  .cs-page-title{
    padding: 20px 10px 10px 10px;
    display: block;
    font-size: 1.8em;
  }
  .cs-form{
    padding: 5px 20px;
  }
  .cs-center{
    text-align: center;
  }
  .form-control.has-error {
    border-color: $colorError;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  }
  .form-control.has-success {
    border-color: $colorSuccess;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  }
  .upload-crop-wrap {
    width: 300px;
    height: 150px;
    margin: 0 auto;
  }

  .alertBox{
    position: fixed;
    max-width: 350px;
    padding: 10px;
    z-index: 2000;
    transition: .5s all;
  }
  .alertBox.show{
    right: 0;
    transition: .5s all;
  }
  .alertBox.hide{
    right: -410px;
    transition: .5s all;
  }
  .content-progressbar{
    position: fixed;
    top: 51px;
    z-index: 100;
    width: calc(100% - 250px);
  }

  .mg-top-15 {
    margin-top: 15px;
  }
</style>
