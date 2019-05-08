
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
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
img{
    width: 80%;
    text-align: center;
}
</style>


<template>
<el-container style="height: 100vh; margin: 0;padding: 0;">

  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <h2>store</h2>


<el-tree :data="store.top" :props="defaultProps" @node-click="handleNodeClick"
    node-key="id"
    :default-expanded-keys="['expend']"
    current-node-key='expend'
                  ref='vuetree'
    ></el-tree>

  </el-aside>

  <el-container>
    <el-header style="text-align: center; font-size: 22px; padding: 20px">
        {{title}}
    </el-header>

    <el-main >
        <div>
        <div v-html=content id=content ></div>
        </div>
    </el-main>
  </el-container>
</el-container>


</template>

<script>
import marked from 'marked'
var vue;
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
                item.url = url + '/' + item.name
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
    if (!vue.selected) return;

    vue.title = vue.selected.label;


    vue.$.get(vue.selected.url, function(data, status, xhr){
        vue.content = marked(data)
    })
}


  export default {
      name: 'app',
    data: function(){
        vue = this;
        var d = {store:{}, content:'', title:''}

        d.store.top = gettree(this.$.ajax, 'http://wiki.me/store/')

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
      methods: {
          handleNodeClick(data)
          {
              vue.selected = data;
              localStorage.setItem("expend", data.url);
              loadmd();
          }
      }
  }
</script>
