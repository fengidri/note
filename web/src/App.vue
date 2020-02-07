
<style>
body{
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#header{
    text-align: center;
    border-bottom: 2px solid;
}
#header div{
    font-size: 8pt;
    text-align: right;
    margin-top: -15pt;
}
#content{
  margin: auto;
  width: 800px;
}
#content h1
{
    color:green;
}

#content h2
{
    margin-top:30pt;
    font-size:30pt;
    counter-increment: counter_sectionl;
    counter-reset:counter_section;
    border-bottom: solid 1px grey;
}
#content h2:before
{
    content:counter(counter_sectionl) '. ';
}

#content h3
{
    font-size:20pt;
    color:black;
    counter-increment: counter_section;
    counter-reset:counter_subsection;
    margin-top:3em;
}
#content h3:first-of-type
{
    margin-top:0em;
}
#content h3:before
{
    content:counter(counter_sectionl) '.' counter(counter_section) '. ';
}

#content h4
{
    margin-top:3em;
    font-size:15pt;
    color:black;
    counter-reset:counter_subsubsection;
    counter-increment: counter_subsection;
}
#content h4:first-of-type{
    margin-top:0em;
}
#content h4:before
{
    content:
    counter(counter_sectionl) '.'
    counter(counter_section)'.'
    counter(counter_subsection) '. ';
}
#content h5
{
    font-size:12pt;
    counter-increment: counter_subsubsection;
    margin-top:3em;
}
#content h5:first-of-type{
    margin-top:0em;
}
#content h5:before
{
    content:
    counter(counter_sectionl) '.'
    counter(counter_section)'.'
    counter(counter_subsection)'.'
    counter(counter_subsubsection)'. ';
}

#foot{
    height: 30em;
    border-top: 1px solid;
    margin-top: 5em;
}

img{
    width: 90%;
    text-align: center;
    border: 1px solid;
}
</style>


<template>
<el-container style="height: 100vh; margin: 0;padding: 0;">

  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <h4>store</h4>


<el-tree :data="store.top" :props="defaultProps" @node-click="handleNodeClick"
    node-key="id"
    :default-expanded-keys="['expend']"
    current-node-key='expend'
                  ref='vuetree'
    ></el-tree>

  </el-aside>

  <el-container>
    <el-header id=header>
        <h3>{{selected.label}}</h3>
        <div>{{selected.file_name}}: {{selected.mtime}}/{{selected.size}}</div>
    </el-header>

    <el-main >
        <div>
        <div @click=content_click v-html=content id=content ></div>
        <el-dialog class=focus width=80% title="" :visible.sync="img.show"  :show-close=false style=''>
            <img  :src=img.src></img>
        </el-dialog>
        </div>
        <div id=foot></div>
    </el-main>
  </el-container>
</el-container>


</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

var vue;


const highlightCode = () => {
  const preEl = document.querySelectorAll('pre')

  preEl.forEach((el) => {
    hljs.highlightBlock(el)
  })
}


function get_title(app)
{
    var title = app.$("#content").find("h1").first().text()

    if (title)
    {
        localStorage.setItem("title:" + app.selected.url, title);
        app.selected.label = title;
    }
}

function gettree(ajax, url)
{
    var d
    var expend =  localStorage.getItem("expend");

    ajax({
        url: url,
        async: false,
        success: function(data)
        {
            var i;
            var item;
            for (i in data)
            {
                item = data[i];
                item.label = item.name.split('.')[0];
                item.file_name = item.name.split('.')[0];
                item.url = url + '/' + item.name

                var label =  localStorage.getItem("title:" + item.url);
                if (label)
                {
                    item.label = label
                }

                if ('directory' == item.type)
                {
                    item.children = gettree(ajax, url + '/' + item.name)
                }
                else{
                    if (item.url == expend)
                    {
                        item.id = 'expend'
                        vue.selected = item;
                    }
                }
            }
            d = data;
        },
    });

    return d;
}


function loadmd()
{
    if (!vue.selected.url) return;

    vue.$.get(vue.selected.url, function(data, status, xhr){
        if (data == vue.origin) return;

        vue.origin = data;
        vue.content = marked(data)
    })
}


export default {
    name: 'app',
    data: function(){
        vue = this;
        var d = {store:{}, content:'', selected:{}, img:{show: false, src: null}}

        d.store.top = gettree(this.$.ajax, 'http://wiki.me/store/')

        if (vue.selected)
            d.selected = vue.selected;

        d.defaultProps =  {
            children: 'children',
            label: 'label'
        }

        setInterval(loadmd, 500, this);
        return d;
    },
    created: function()
    {
        loadmd();
    },
    watch:{
        content: function(val){
            this.$nextTick(()=>{
                highlightCode();
                get_title(this);
            })
        }
    },
    methods: {
        handleNodeClick(data)
        {
            vue.selected = data;
            localStorage.setItem("expend", data.url);
            loadmd();
        },
        content_click(e)
        {
            if (e.target.nodeName.toLowerCase() === 'img') {
                this.img.show = true;
                this.img.src = e.target.src
                return
            }
            this.$emit('click', this.m)

        },
    }
}
</script>
