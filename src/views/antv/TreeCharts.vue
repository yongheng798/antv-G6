<!--
 * @Descripttion: 陈品富写的demo描述
 * @version: 1.0
 * @Author: chenpinfu~陈品富
 * @Date: 2020-09-05 17:21:04
 * @LastEditors: chenpinfu~陈品富
 * @LastEditTime: 2020-09-07 23:02:03
-->
<template>
  <!--g6 demo引用演示  -->
  <div class="charts-container-box">
    <h3>G6 决策树</h3>
    <div id="mountNode" class="chart-box" />
  </div>
</template>

<script>
import G6 from '@antv/g6'
import insertCss from 'insert-css'

export default {
  data() {
    return {}
  },
  mounted() {
    console.log(G6.Global.version)
    this.initChart()
  },
  methods: {
    initChart() {
      this.createCharts()
    },
    createCharts() {
      // 数据
      const data = {
        // 点集
        nodes: [],
        // 边集
        // 边集
        edges: [
          // 表示一条从 node1 节点连接到 node2 节点的边
          {
            source: 'node1', // 起始点 id
            target: 'node2', // 目标点 id
            label: '我是连线' // 边的文本
          }
        ],
        id: 'A',
        x: 20,
        y: 20,
        children: [
          {
            id: 'A1',
            x: 20,
            y: 20,
            children: [
              { id: 'A11',
                x: 20,
                y: 20
              },
              { id: 'A12',
                x: 20,
                y: 20
              },
              { id: 'A13',
                x: 20,
                y: 20
              },
              { id: 'A14',
                x: 20,
                y: 20
              }
            ]
          },
          {
            id: 'A2',
            x: 20,
            y: 20,
            children: [
              {
                id: 'A21',
                children: [
                  { id: 'A211',
                    x: 20,
                    y: 20
                  },
                  { id: 'A212',
                    x: 20,
                    y: 20
                  }
                ]
              },
              {
                id: 'A22',
                x: 20,
                y: 20
              }
            ]
          }
        ]
      }

      // 左下角视图
      insertCss(`
        .g6-minimap-container {
          border: 1px solid #e2e2e2;
        }
        .g6-minimap-viewport {
          border: 2px solid rgb(25, 128, 255);
        }
        .g6-component-toolbar li {
          list-style-type: none !important;
        }
      `)
      // 自定义节点1
      G6.registerNode('card-node', {
        draw: function drawShape(cfg, group) {
          const r = 2
          const color = cfg.error ? '#F4664A' : '#30BF78'
          const w = cfg.size[0]
          const h = cfg.size[1]
          const shape = group.addShape('rect', {
            attrs: {
              x: -w / 2,
              y: -h / 2,
              width: w, // 200,
              height: h, // 60
              stroke: color,
              radius: r,
              fill: '#fff'
            },
            name: 'main-box',
            draggable: true
          })

          group.addShape('rect', {
            attrs: {
              x: -w / 2,
              y: -h / 2,
              width: w, // 200,
              height: h / 2, // 60
              fill: color,
              radius: [r, r, 0, 0]
            },
            name: 'title-box',
            draggable: true
          })

          // title text
          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              x: -w / 2 + 8,
              y: -h / 2 + 2,
              lineHeight: 20,
              text: cfg.id,
              fill: '#fff'
            },
            name: 'title'
          })
          cfg.children &&
      group.addShape('marker', {
        attrs: {
          x: w / 2,
          y: 0,
          r: 6,
          cursor: 'pointer',
          symbol: G6.Marker.collapse,
          stroke: '#666',
          lineWidth: 1,
          fill: '#fff'
        },
        name: 'collapse-icon'
      })
          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              x: -w / 2 + 8,
              y: -h / 2 + 24,
              lineHeight: 20,
              text: 'description',
              fill: 'rgba(0,0,0, 1)'
            },
            name: `description`
          })
          return shape
        },
        setState(name, value, item) {
          if (name === 'collapsed') {
            const marker = item.get('group').find((ele) => ele.get('name') === 'collapse-icon')
            const icon = value ? G6.Marker.expand : G6.Marker.collapse
            marker.attr('symbol', icon)
          }
        }
      })

      // 自定义节点2
      const ICON_MAP = {
        a: 'https://gw.alipayobjects.com/mdn/rms_8fd2eb/afts/img/A*0HC-SawWYUoAAAAAAAAAAABkARQnAQ',
        b: 'https://gw.alipayobjects.com/mdn/rms_8fd2eb/afts/img/A*sxK0RJ1UhNkAAAAAAAAAAABkARQnAQ'
      }

      G6.registerNode(
        'card-node2',
        {
          drawShape: function drawShape(cfg, group) {
            const color = cfg.error ? '#F4664A' : '#30BF78'
            const r = 2
            const shape = group.addShape('rect', {
              attrs: {
                x: 0,
                y: 0,
                width: 200,
                height: 60,
                stroke: color,
                radius: r
              },
              name: 'main-box',
              draggable: true
            })

            group.addShape('rect', {
              attrs: {
                x: 0,
                y: 0,
                width: 200,
                height: 20,
                fill: color,
                radius: [r, r, 0, 0]
              },
              name: 'title-box',
              draggable: true
            })

            // left icon
            group.addShape('image', {
              attrs: {
                x: 4,
                y: 2,
                height: 16,
                width: 16,
                cursor: 'pointer',
                img: ICON_MAP[cfg.nodeType || 'app']
              },
              name: 'node-icon'
            })

            // title text
            group.addShape('text', {
              attrs: {
                textBaseline: 'top',
                y: 2,
                x: 24,
                lineHeight: 20,
                text: cfg.title,
                fill: '#fff'
              },
              name: 'title'
            })

            if (cfg.nodeLevel > 0) {
              group.addShape('marker', {
                attrs: {
                  x: 184,
                  y: 30,
                  r: 6,
                  cursor: 'pointer',
                  symbol: cfg.collapse ? G6.Marker.expand : G6.Marker.collapse,
                  stroke: '#666',
                  lineWidth: 1
                },
                name: 'collapse-icon'
              })
            }

            // The content list
            cfg.panels.forEach((item, index) => {
              // name text
              group.addShape('text', {
                attrs: {
                  textBaseline: 'top',
                  y: 25,
                  x: 24 + index * 60,
                  lineHeight: 20,
                  text: item.title,
                  fill: 'rgba(0,0,0, 0.4)'
                },
                name: `index-title-${index}`
              })

              // value text
              group.addShape('text', {
                attrs: {
                  textBaseline: 'top',
                  y: 42,
                  x: 24 + index * 60,
                  lineHeight: 20,
                  text: item.value,
                  fill: '#595959'
                },
                name: `index-title-${index}`
              })
            })
            return shape
          }
        },
        'single-node'
      )
      // 边动画
      G6.registerEdge(
        'circle-running',
        {
          afterDraw(cfg, group) {
            // get the first shape in the group, it is the edge's path here=
            const shape = group.get('children')[0]
            // the start position of the edge's path
            const startPoint = shape.getPoint(0)

            // add red circle shape
            const circle = group.addShape('circle', {
              attrs: {
                x: startPoint.x,
                y: startPoint.y,
                fill: '#1890ff',
                r: 3
              },
              name: 'circle-shape'
            })

            // animation for the red circle
            circle.animate(
              (ratio) => {
                // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
                // get the position on the edge according to the ratio
                const tmpPoint = shape.getPoint(ratio)
                // returns the modified configurations here, x and y here
                return {
                  x: tmpPoint.x,
                  y: tmpPoint.y
                }
              },
              {
                repeat: true, // Whether executes the animation repeatly
                duration: 3000 // the duration for executing once
              }
            )
          }
        },
        'cubic' // extend the built-in edge 'cubic'
      )
      // 鼠标经过提示
      const tooltip = new G6.Tooltip({
        // offsetX and offsetY include the padding of the parent container
        // offsetX 与 offsetY 需要加上父容器的 padding
        offsetX: 16 + 10,
        offsetY: 24 + 10,
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        itemTypes: ['node', 'edge'],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          const outDiv = document.createElement('div')
          outDiv.style.width = 'fit-content'
          // outDiv.style.padding = '0px 0px 20px 0px';
          outDiv.innerHTML = `
            <h4>Custom Content</h4>
            <ul>
              <li>Type: ${e.item.getType()}</li>
            </ul>
            <ul>
              <li>Label: ${e.item.getModel().label || e.item.getModel().id}</li>
            </ul>`
          return outDiv
        }
      })

      // 工具栏
      const toolbar = new G6.ToolBar()

      // 放大缩小
      const minimap = new G6.ImageMinimap({
        height: 100,
        padding: 10,
        graphImg: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*DcGMQ7AN3Z0AAAAAAAAAAABkARQnAQ'
      })

      const width = document.getElementById('mountNode').scrollWidth
      const height = document.getElementById('mountNode').scrollHeight || 500

      // 声明实例
      const graph = new G6.TreeGraph({
        container: 'mountNode',
        width,
        height,
        defaultNode: {
          type: 'card-node',
          size: [200, 100],
          offset: 200,
          style: {
            fill: '#C6E5FF',
            stroke: '#5B8FF9'
          }
        },
        defaultEdge: {
          type: 'cubic-vertical',
          style: {
            stroke: '#ff0000',
            // endArrow: true,默认
            endArrow: {
              // 箭头样式
              path: G6.Arrow.vee(15, 20, 15), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
              d: 15,
              fill: '#ff0000',
              stroke: '#ff0000',
              opacity: 0.5,
              lineWidth: 0
            }
          }
        },
        // 交互样式
        nodeStateStyles: {
          hover: {
            lineWidth: 2,
            stroke: '#1890ff',
            fill: '#e6f7ff'
          }
        },
        layout: {
          type: 'indented',
          direction: 'LR',
          dropCap: false,
          indent: 200,
          getHeight: () => {
            return 60
          }
        },
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'] // 允许拖拽画布、放缩画布、拖拽节点
        },
        // 设置为true，启用 redo & undo 栈功能
        enabledStack: true,
        fitViewPadding: [20, 30, 50, 20],
        plugins: [minimap, tooltip, toolbar]
      })
      this.$nextTick(() => {
        graph.data(data) // 加载数据
        graph.render() // 渲染
        graph.fitView()
      })
      // 鼠标经过交互事件
      graph.on('node:mouseenter', (evt) => {
        const { item } = evt
        graph.setItemState(item, 'hover', true)
      })

      graph.on('node:mouseleave', (evt) => {
        const { item } = evt
        graph.setItemState(item, 'hover', false)
      })
      graph.on('node:click', (e) => {
        if (e.target.get('name') === 'collapse-icon') {
          e.item.getModel().collapsed = !e.item.getModel().collapsed
          graph.setItemState(e.item, 'collapsed', e.item.getModel().collapsed)
          graph.layout()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.g6-minimap-container {
  border: 1px solid #e2e2e2;
}
.g6-minimap-viewport {
  border: 2px solid rgb(25, 128, 255);
}
</style>
