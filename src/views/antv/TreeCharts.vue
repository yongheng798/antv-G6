<!--
 * @Descripttion: 陈品富写的demo描述
 * @version: 1.0
 * @Author: chenpinfu~陈品富
 * @Date: 2020-09-05 17:21:04
 * @LastEditors: chenpinfu~陈品富
 * @LastEditTime: 2020-09-18 23:58:27
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
    return {
      level: 3
    }
  },
  mounted() {
    this.$nextTick(() => {
      const e = document.createEvent('Event')
      e.initEvent('resize', true, true)
      window.dispatchEvent(e)
      console.log(G6.Global.version)
      this.initChart()
    })
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
        collapsed: false,
        children: [
          {
            id: 'A1',
            x: 20,
            y: 20,
            collapsed: false,
            children: [
              { id: 'A11',
                x: 20,
                y: 20,
                collapsed: false
              },
              { id: 'A12',
                x: 20,
                y: 20,
                collapsed: false
              },
              { id: 'A13',
                x: 20,
                y: 20,
                collapsed: false
              },
              { id: 'A14',
                x: 20,
                y: 20,
                collapsed: false
              }
            ]
          },
          {
            id: 'A2',
            x: 20,
            y: 20,
            collapsed: true,
            children: [
              {
                id: 'A21',
                collapsed: false,
                children: [
                  { id: 'A211',
                    x: 20,
                    y: 20,
                    collapsed: false
                  },
                  { id: 'A212',
                    x: 20,
                    y: 20,
                    collapsed: false
                  }
                ]
              },
              {
                id: 'A22',
                x: 20,
                y: 20,
                collapsed: true
              }
            ]
          }
        ]
      }

      // 载入自定义节点
      this.registerNodeFn()
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
      // 实例化 minimap 插件
      const minimap = new G6.Minimap({
        size: [100, 100],
        className: 'minimap',
        type: 'delegate'
      })

      const width = document.getElementById('mountNode').scrollWidth
      const height = document.getElementById('mountNode').scrollHeight || 500
      console.log('G6.Util====', G6.Util)

      const mindmapLayout = {
        layout: {
          type: 'mindmap',
          direction: 'V', // H / V
          getWidth: (d) => {
            return 100
          },
          getHeight: (d) => {
            return 100
          },
          getHGap: (d) => {
            return 100
          }, // 每个节点的水平间隙
          getVGap: (d) => {
            return 100
          }, // 每个节点的垂直间隙
          getSide: function getSide(d) {
            return 'right'
          }
        }
      }
      console.log(mindmapLayout)

      const dendrogramLayout = {
        layout: {
          type: 'dendrogram',
          direction: 'LR', // H / V / LR / RL / TB / BT
          nodeSep: 320, // 同层次节点之间的间距
          rankSep: 320, // 相邻层级节点之间的间距
          nodeSize: 20, // 节点大小
          subTreeSep: 10, // 子树之间的间距
          isHorizontal: true // 是否是水平方向，默认为水平方向
        }
      }
      console.log(dendrogramLayout)
      const compactBoxLayout = {
        layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: function getId(d) {
            return d.id
          },
          getHeight: function getHeight() {
            return 100
          },
          getWidth: function getWidth() {
            return 220
          },
          getVGap: function getVGap() {
            return 10
          },
          getHGap: function getHGap() {
            return 30
          }
        }
      }
      console.log(compactBoxLayout)
      const indentedLayout = {
        layout: {
          type: 'indented',
          direction: 'LR',
          dropCap: false,
          indent: 360,
          nodeSep: 320,
          rankSep: 320,
          radial: false,
          getWidth: (d) => {
            return 100
          },
          getHeight: (d) => {
            return 100
          }
          // getHGap: (d) => {
          //   return 100
          // }, // 每个节点的水平间隙
          // getVGap: (d) => {
          //   return 100
          // }, // 每个节点的垂直间隙
          // getSide: function getSide(d) {
          //   return 'right'
          // }
        }
      }
      console.log(indentedLayout)
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
          type: 'circle-running',
          // label: 'edge-label',
          style: {
            stroke: '#555',
            // endArrow: true,默认
            endArrow: {
              // 箭头样式
              path: G6.Arrow.vee(), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
              fill: '#555',
              stroke: '#555',
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
        ...compactBoxLayout,
        modes: {
          default: [// 允许拖拽画布、放缩画布、拖拽节点
            'drag-canvas', 'zoom-canvas', 'drag-node'
            // {
            //   type: 'collapse-expand',
            //   trigger: 'click',
            //   onChange: (item, collapsed) => {
            //     const data = item.get('model').data
            //     data.collapsed = collapsed
            //     return false
            //   }
            //   // shouldBegin: (e) => {
            //   //   // 若当前操作的节点 id 为 'node1'，则不发生 collapse-expand
            //   //   if (e.item && e.item.getModel().id === 'node1') return false
            //   //   return true
            //   // }
            // }
          ]
        },
        fitView: true,
        // animate: true,
        // 设置为true，启用 redo & undo 栈功能
        enabledStack: true,
        fitViewPadding: [20, 30, 50, 20],
        plugins: [minimap, tooltip, toolbar]
      })

      graph.layout(true)
      graph.data(data) // 加载数据
      graph.render() // 渲染
      graph.fitView()

      // 修复拖拽留痕
      graph.get('canvas').set('localRefresh', false)
      // 鼠标经过交互事件
      graph.on('node:mouseenter', (evt) => {
        const { item } = evt
        graph.setItemState(item, 'hover', true)
        const edges = item.getEdges()// 获取与当前节点有关联的所有边
        // const node = item.getAnchorPoints()
        console.log('node获取节点上面定义的锚点', evt)
        console.log('item====', item)
        edges.forEach((edge) => graph.setItemState(edge, 'running', true))
      })
      graph.on('node:mouseleave', (evt) => {
        const { item } = evt
        graph.setItemState(item, 'default', false)
        // 取消多个状态
        graph.clearItemStates(item, ['bodyState:health', 'hover', 'active'])
        const edges = item.getEdges()
        edges.forEach((edge) => graph.setItemState(edge, 'running', false))
      })
      // 点击时选中，再点击时取消
      graph.on('node:click', (evt) => {
        const { item } = evt
        graph.setItemState(item, 'hover', !item.hasState('default')) // 切换选中
        // 展开收缩
        if (evt.target.get('name') === 'collapse-icon') {
          item.getModel().collapsed = !item.getModel().collapsed
          graph.setItemState(item, 'collapsed', item.getModel().collapsed)
          graph.layout()
        }
      })
    },

    // 自定义节点
    registerNodeFn() {
      // 自定义节点1
      G6.registerNode(
        'card-node',
        {
          draw: function drawShape(cfg, group) {
            console.log('节点的cfg', cfg)
            console.log('节点的group', group)
            const r = 2
            const color = cfg.error ? '#F4664A' : '#30BF78'
            // 展开收缩样式
            const collapseStyle = cfg.collapsed ? '#873bf4a1' : '#4caf509c'
            const collapseText = cfg.collapsed ? '+' : '-'
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
                y: -h / 2 + 10,
                lineHeight: 20,
                text: cfg.id,
                fontSize: 14,
                fontWeight: 600,
                fill: '#fff'
              },
              name: 'title'
            })
            cfg.children &&
      group.addShape('marker', {
        attrs: {
          x: w / 2,
          y: -h / 4,
          r: 6,
          cursor: 'pointer',
          symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
          stroke: collapseStyle,
          lineWidth: 1,
          text: collapseText,
          fill: collapseStyle,
          isCollapseShape: true
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

            // 百分占比条条形
            group.addShape('rect', {
              attrs: {
                x: -w / 2.1,
                y: -h / 20,
                width: w - 10, // 200,
                height: 10, // 60
                fill: '#ccc',
                radius: [r, r, r, r]
              },
              name: 'percentage-box1',
              draggable: true
            })

            group.addShape('rect', {
              attrs: {
                x: -w / 2.1,
                y: -h / 20,
                width: (w - 10) * 0.5, // 200,
                height: 10, // 60
                fill: 'red',
                radius: [r, r, r, r]
              },
              name: 'percentage-box1',
              draggable: true
            })

            return shape
          },
          setState(name, value, item) {
            const group = item.getContainer()
            const shape = group.get('children')[0] // 顺序根据 draw 时确定
            const shape2 = group.get('children')[1] // 顺序根据 draw 时确定

            // 自定义经过效果和默认效果样式
            const hoverStyle = {
              fill: 'red',
              stroke: 'yellow'
            }
            const defaultStyle = {
              fill: '#fff',
              stroke: '#30BF78'
            }
            // 采用switch
            switch (name) {
              case 'collapsed':
              // eslint-disable-next-line no-case-declarations
                const marker = item.get('group').find((ele) => ele.get('name') === 'collapse-icon')
                // eslint-disable-next-line no-case-declarations
                const icon = value ? G6.Marker.expand : G6.Marker.collapse
                // eslint-disable-next-line no-case-declarations
                const collapseStyle = value ? '#873bf4a1' : '#4caf509c'
                // eslint-disable-next-line no-case-declarations
                const lineStyle = value ? 2 : 1
                marker.attr('fill', collapseStyle)
                marker.attr('stroke', collapseStyle)
                marker.attr('lineWidth', lineStyle)
                marker.attr('symbol', icon)
                break
              case 'hover':
                shape.attr(hoverStyle)
                shape2.attr('fill', '#003399')
                break
              case 'default':
                shape.attr(hoverStyle)
                shape2.attr('fill', '#003399')
                break
              case 'click':
                shape.attr(hoverStyle)
                shape2.attr('fill', '#003399')
                break
              default:
                shape.attr(defaultStyle)
                shape2.attr('fill', '#30BF78')
                break
            }
          },
          update: null,
          // update(cfg, node) {
          //   const group = node.getContainer()
          //   this.updateLinkPoints(cfg, group)
          // },
          // 边的位置
          getAnchorPoints() {
            return [
              [0, 0.25],
              [1, 0.25]
            ]
          }
        }, 'single-node')

      // 边动画
      G6.registerEdge(
        'circle-running',
        {
          // draw(cfg, group) {
          //   const startPoint = cfg.startPoint
          //   const endPoint = cfg.endPoint
          //   const shape = group.addShape('path', {
          //     attrs: {
          //       stroke: '#555',
          //       path: [
          //         ['M', startPoint.x, startPoint.y],
          //         ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
          //         ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
          //         ['L', endPoint.x, endPoint.y]
          //       ],
          //       endArrow: {
          //         // 箭头样式
          //         path: G6.Arrow.vee(), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
          //         fill: '#555',
          //         stroke: '#555',
          //         opacity: 0.5,
          //         lineWidth: 0
          //       }
          //     },
          //     // must be assigned in G6 3.3 and later versions. it can be any value you want
          //     name: 'path-shape'
          //   })
          //   return shape
          // },
          // afterDraw(cfg, group) {
          //   // get the first shape in the group, it is the edge's path here=
          //   const shape = group.get('children')[0]
          //   // the start position of the edge's path
          //   const startPoint = shape.getPoint(0)

          //   // add red circle shape
          //   const circle = group.addShape('circle', {
          //     attrs: {
          //       x: startPoint.x,
          //       y: startPoint.y,
          //       fill: '#1890ff',
          //       r: 3
          //     },
          //     name: 'circle-shape'
          //   })

          //   // animation for the red circle
          //   circle.animate(
          //     (ratio) => {
          //       // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
          //       // get the position on the edge according to the ratio
          //       const tmpPoint = shape.getPoint(ratio)
          //       // returns the modified configurations here, x and y here
          //       return {
          //         x: tmpPoint.x,
          //         y: tmpPoint.y
          //       }
          //     },
          //     {
          //       repeat: true, // Whether executes the animation repeatly
          //       duration: 3000 // the duration for executing once
          //     }
          //   )
          // },
          // getPath(points) {
          //   const path = []
          //   path.push(['M', points[0].x, points[0].y])
          //   path.push([
          //     'C',
          //     points[1].x,
          //     points[1].y,
          //     points[2].x,
          //     points[2].y,
          //     points[3].x,
          //     points[3].y
          //   ])
          //   return path
          // },
          setState(name, value, item) {
            const shape = item.get('keyShape')
            // const startPoint = item.startPoint
            // const endPoint = item.endPoint
            // lineDash array
            const lineDash = [2, 2, 2, 2]
            if (name === 'running') {
              if (value) {
                let index = 0
                shape.animate(
                  () => {
                    index++
                    if (index > 9) {
                      index = 0
                    }
                    const res = {
                      lineDash,
                      stroke: 'red',
                      lineDashOffset: -index,
                      // path: [
                      //   ['M', startPoint.x, startPoint.y],
                      //   ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
                      //   ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
                      //   ['L', endPoint.x, endPoint.y]
                      // ],
                      endArrow: {
                        // 箭头样式
                        path: G6.Arrow.vee(), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
                        fill: 'red',
                        stroke: 'red',
                        opacity: 0.5,
                        lineWidth: 0
                      }
                    }
                    // return the params for this frame
                    return res
                  },
                  {
                    repeat: true,
                    duration: 3000
                  }
                )
              } else {
                shape.stopAnimate()
                shape.attr(
                  { lineDash: null,
                    stroke: '#555',
                    endArrow: {
                      // 箭头样式
                      path: G6.Arrow.vee(), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
                      fill: '#555',
                      stroke: '#555',
                      opacity: 0.5,
                      lineWidth: 0
                    }
                  }
                )
              }
            }
          }
        },
        'cubic-horizontal' // extend the built-in edge 'cubic'
      )
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
