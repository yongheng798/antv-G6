<template>
  <div class="container-box">
    <h3>hello world</h3>
    <div id="container" style="background:#ccc" />
  </div>
</template>

<script>
import G6 from '@antv/g6'
import Hierarchy from '@antv/hierarchy'
import { tree } from './treeData'
export default {
  data() {
    return {
      tree: tree
    }
  },
  mounted() {
    this.initChart()
    const e = document.createEvent('Event')
    e.initEvent('resize', true, true)
    window.dispatchEvent(e)
  },
  methods: {
    initChart() {
      this.createChart()
    },
    createChart() {
      const CANVAS_WIDTH = window.innerWidth
      const CANVAS_HEIGHT = window.innerHeight

      const NODE_WIDTH = 198
      const NODE_HEIGHT = 36
      const getNodeConfig = function getNodeConfig(node) {
        let config = {
          basicColor: '#722ED1',
          fontColor: 'rgb(51, 51, 51)',
          bgColor: '#ffffff'
        }
        // 请无视这种中文的判断，这里获取的数据为中文，就不做额外处理，直接拿来判断了
        switch (node.type) {
          case '标签': {
            config = {
              basicColor: 'rgba(61, 77, 102, 1)',
              fontColor: 'rgb(51, 51, 51)',
              bgColor: '#ffffff'
            }
            break
          }
          case '分类': {
            config = {
              basicColor: 'rgba(159, 230, 184, 1)',
              fontColor: 'rgb(51, 51, 51)',
              bgColor: '#ffffff'
            }
            break
          }
          case '业务问题':
            config = {
              basicColor: 'rgba(45, 183, 245, 1)',
              fontColor: 'rgb(51, 51, 51)',
              bgColor: '#ffffff'
            }
            break
          default:
            break
        }
        return config
      }

      // 由于节点的文本不会换行，根据节点的宽度切分节点详情文本到数组中，然后进行换行
      const fittingStringLine = function fittingStringLine(str, maxWidth, fontSize) {
        str = str.replace(/\n/gi, '')
        const fontWidth = fontSize * 1.3 // 字号+边距

        const actualLen = Math.floor(maxWidth / fontWidth)
        let width = strLen(str) * fontWidth
        const lineStr = []
        while (width > 0) {
          const substr = str.substring(0, actualLen)
          lineStr.push(substr)

          str = str.substring(actualLen)
          width = strLen(str) * fontWidth
        }
        return lineStr
      }

      const strLen = function strLen(str) {
        let len = 0
        if (!str) {
          return len
        }

        for (let i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
            len++
          } else {
            len += 2
          }
        }
        return len
      }
      const nodeBasicMethod = {
        createNodeBox: function createNodeBox(group, config, width, height, isRoot) {
          // 最外面的大矩形，作为节点元素的容器
          const container = group.addShape('rect', {
            attrs: {
              x: 0,
              y: 0,
              width: width,
              height: height
            },
            className: 'node-container'
          })
          if (!isRoot) {
            // 不是跟节点，创建左边的小圆点
            group.addShape('circle', {
              attrs: {
                x: 3,
                y: height / 2,
                r: 6,
                fill: config.basicColor
              },
              className: 'node-left-circle'
            })
          }
          // 节点标题的矩形
          group.addShape('rect', {
            attrs: {
              x: 3,
              y: 0,
              width: width - 19,
              height: height,
              fill: config.bgColor,
              radius: 2,
              cursor: 'pointer'
            },
            className: 'node-main-container'
          })

          // 节点标题左边的粗线
          group.addShape('rect', {
            attrs: {
              x: 3,
              y: 0,
              width: 3,
              height: height,
              fill: config.basicColor
            },
            className: 'node-left-line'
          })
          return container
        },
        createDetailIcon: function createDetailIcon(group) {
          // icon外面的矩形，用来计算icon的宽度
          const iconRect = group.addShape('rect', {
            attrs: {
              fill: '#FFF',
              radius: 2,
              cursor: 'pointer'
            }
          })
          iconRect.attr({
            x: 154,
            y: 6,
            width: 24,
            height: 24
          })
          // 设置icon的图片
          group.addShape('text', {
            attrs: {
              x: 154,
              y: 6,
              text: '展开',
              stroke: 'red',
              cursor: 'pointer',
              opacity: 1
            },
            className: 'node-detail-icon'
          })
          // 放一个透明的矩形在 icon 区域上，方便监听点击
          return iconRect.getBBox().width
        },
        createNodeName: (group, config) => {
          group.addShape('text', {
            attrs: {
              // 根据 icon 的宽度计算出剩下的留给 name 的长度
              text: 'node title',
              x: 18,
              y: 18,
              fontSize: 13,
              fontWeight: 400,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
              cursor: 'pointer'
            },
            className: 'node-name-text'
          })
        },
        createNodeDetail: function createNodeDetail(group, config) {
          // 节点的类别说明，即 # 业务问题
          group.addShape('text', {
            attrs: {
              text: '',
              x: 18,
              y: 45,
              fontSize: 10,
              lineHeight: 16,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.basicColor,
              cursor: 'pointer'
            },
            className: 'node-detail-info'
          })
          // 节点的详情
          group.addShape('text', {
            attrs: {
              text: '',
              x: 18,
              y: 45,
              // height: 0,
              fontSize: 11,
              lineHeight: 16,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'rgb(51, 51, 51)',
              cursor: 'pointer'
            },
            className: 'node-detail-text'
          })
          // 节点的 查看详情 按钮
          group.addShape('text', {
            attrs: {
              text: '',
              x: 18,
              y: 61,
              fontSize: 11,
              lineHeight: 16,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.basicColor,
              cursor: 'pointer'
            },
            className: 'node-detail-link'
          })
          // 节点的 反馈问题 按钮
          group.addShape('text', {
            attrs: {
              text: '',
              x: 99,
              y: 61,
              fontSize: 11,
              lineHeight: 16,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.basicColor,
              cursor: 'pointer'
            },
            className: 'node-detail-feedback'
          })
        },
        createNodeMarker: function createNodeMarker(
          group,
          collapsed,
          x,
          y,
          childrenNum
        ) {
          // 伸缩按钮的圆形背景
          group.addShape('circle', {
            attrs: {
              x: x,
              y: y,
              r: 13,
              fill: 'rgba(47, 84, 235, 0.05)',
              opacity: 0,
              zIndex: -2
            },
            className: 'collapse-icon-bg'
          })
          // 伸缩按钮的 节点数量 文字
          group.addShape('text', {
            attrs: {
              x: x,
              y: y + 7 / 2,
              text: collapsed ? childrenNum : '-',
              textAlign: 'center',
              fontSize: 10,
              lineHeight: 7,
              stroke: 'rgba(0,0,0,0.25)',
              fill: 'rgba(0,0,0,0)',
              opacity: 1,
              cursor: 'pointer'
            },
            className: 'collapse-icon-num'
          })
          // 伸缩按钮的圆形边框
          group.addShape('circle', {
            attrs: {
              x: x,
              y: y,
              r: 7,
              stroke: 'rgba(0,0,0,0.25)',
              fill: 'rgba(0,0,0,0)',
              opacity: 1,
              cursor: 'pointer'
            },
            className: 'collapse-icon'
          })
        },
        afterDraw: function afterDraw(cfg, group) {
          // 伸缩icon的背景色交互
          const collapseIcon = group.findByClassName('collapse-icon')
          if (collapseIcon) {
            const bg = group.findByClassName('collapse-icon-bg')
            // 监听事件
            collapseIcon.on('mouseenter', function() {
              bg.attr('opacity', 1)
              graph.get('canvas').draw()
            })
            collapseIcon.on('mouseleave', function() {
              bg.attr('opacity', 0)
              graph.get('canvas').draw()
            })
          }

          // 下拉展示与隐藏节点详情
          const nodeDetailBox = group.findByClassName('node-detail-icon')
          nodeDetailBox.on('click', function() {
            nodeBasicMethod.handleDetail(cfg, group)
          })
        },
        handleDetail: function handleDetail(cfg, group) {
          // const circle = group.findByClassName('node-left-circle')
          const mainContainer = group.findByClassName('node-main-container')
          const nodeLeftLine = group.findByClassName('node-left-line')
          const rightCircleBg = group.findByClassName('collapse-icon-bg')
          const rightCircleIconNum = group.findByClassName('collapse-icon-num')
          const rightCircleIcon = group.findByClassName('collapse-icon')

          const nodeDetailText = group.findByClassName('node-detail-text')
          const nodeDetailInfo = group.findByClassName('node-detail-info')
          const nodeDetailLink = group.findByClassName('node-detail-link')
          const nodeDetailFeedback = group.findByClassName('node-detail-feedback')

          // 查找节点在树上的下方节点
          const node = graph.findById(cfg.id)
          const nodes = graph.findAll('node', item => {
            const model = item.getModel()
            return model.level === node.getModel().level
          })
          const leftNodes = nodes.slice(nodes.indexOf(node) + 1)

          let nodeHeight
          if (cfg.showDetail) {
            // 详情已经展开，开始关闭详情
            nodeHeight = NODE_HEIGHT

            // 关闭详情
            nodeDetailText.attr('text', '')
            nodeDetailInfo.attr('text', '')
            nodeDetailLink.attr('text', '')
            nodeDetailFeedback.attr('text', '')

            // 下方节点上移
            leftNodes.forEach(leftNode => {
              leftNode.getModel().y = leftNode.getBBox().y - 80
              graph.updateItem(leftNode, {
                y: leftNode.getBBox().y - cfg.nodeHeight + NODE_HEIGHT
              })
            })

            cfg.showDetail = false
          } else {
            // 详情未展开，开始展开详情

            // 展示详情
            const detailText = fittingStringLine(cfg.value, 198, 12)
            nodeDetailText.attr('text', detailText.join('\n'))
            nodeDetailText.attr('y', 45 + 16 + detailText.length * 8)

            nodeDetailInfo.attr('text', `# ${cfg.type}`)
            nodeDetailLink.attr('text', '查看详情')
            nodeDetailLink.attr('y', 45 + 16 + detailText.length * 16 + 16)
            nodeDetailFeedback.attr('text', '反馈问题')
            nodeDetailFeedback.attr('y', 45 + 16 + detailText.length * 16 + 16)

            nodeHeight = 45 + 16 + (detailText.length + 1) * 16 + 16

            // 下方的节点下移
            leftNodes.forEach(leftNode => {
              leftNode.getModel().y = leftNode.getBBox().y + 80
              graph.updateItem(leftNode, {
                y: leftNode.getBBox().y + nodeHeight - cfg.nodeHeight
              })
            })

            cfg.showDetail = true
          }
          cfg.nodeHeight = nodeHeight

          // 调节节点元素高度
          // circle.attr("y", nodeHeight / 2);
          mainContainer.attr('height', nodeHeight)
          nodeLeftLine.attr('height', nodeHeight)
          if (rightCircleBg && rightCircleIconNum && rightCircleIcon) {
            rightCircleBg.attr('y', nodeHeight / 2)
            // 计算伸缩icon的位置，G6在这里有个坑，canvas模式下的文本位置会产生偏差
            rightCircleIconNum.attr(
              'y',
              nodeHeight / 2 + 5 + (nodeHeight - NODE_HEIGHT) * 0.1
            )
            rightCircleIcon.attr('y', nodeHeight / 2)
          }

          // 更新当前节点的高度
          graph.updateItem(
            node,
            Object.assign(cfg, {
              style: {
                height: nodeHeight
              }
            })
          )
          graph.get('canvas').draw()
        },
        setState: function setState(name, value, item) {
          const hasOpacityClass = ['node-detail-icon', 'collapse-icon-bg']
          const group = item.getContainer()
          const childrenList = group.get('children')
          graph.setAutoPaint(false)
          if (name === 'emptiness') {
            if (value) {
              childrenList.forEach(function(shape) {
                if (hasOpacityClass.indexOf(shape.get('className')) > -1) {
                  return
                }
                shape.attr('opacity', 0.4)
              })
            } else {
              childrenList.forEach(function(shape) {
                if (hasOpacityClass.indexOf(shape.get('className')) > -1) {
                  return
                }
                shape.attr('opacity', 1)
              })
            }
          }
          graph.setAutoPaint(true)
        }
      }

      G6.registerNode(
        'tree-node',
        {
          drawShape: function drawShape(cfg, group) {
            // 获取节点的颜色配置
            const config = getNodeConfig(cfg)
            const isRoot = cfg.type === '标签'
            // 最外面的大矩形
            // 这里的宽度为写死的宽度，全部节点的宽度统一，高度为data在处理时赋予的高度
            const container = nodeBasicMethod.createNodeBox(
              group,
              config,
              NODE_WIDTH,
              cfg.nodeHeight,
              isRoot
            )
            // 创建节点详情展开关闭的icon
            nodeBasicMethod.createDetailIcon(group)
            // 创建节点标题
            nodeBasicMethod.createNodeName(group, config)
            // 创建节点详情
            nodeBasicMethod.createNodeDetail(group, config)

            const childrenNum = (cfg.children || []).length
            if (childrenNum > 0) {
              // 创建节点的伸缩icon
              nodeBasicMethod.createNodeMarker(
                group,
                cfg.collapsed,
                191,
                18,
                childrenNum
              )
            }

            return container
          },
          afterDraw: nodeBasicMethod.afterDraw
          // setState: nodeBasicMethod.setState
        },
        'single-shape'
      )
      const graph = new G6.TreeGraph({
        container: 'container',

        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        defaultNode: {
          shape: 'tree-node',
          // 全局设置节点的锚点控制点，分别在左侧中间和右侧中间
          anchorPoints: [[0, 0.5], [1, 0.5]]
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: 'rgba(0,0,0,0.25)'
          }
        },
        modes: {
          default: [
            {
              type: 'collapse-expand',
              // 判断是否开始伸缩
              shouldBegin: function shouldBegin(e) {
                console.log(
                  'shouldBegin',
                  e.target.get('className') === 'collapse-icon'
                )
                // 点击 node 禁止展开收缩，只有在点击到的是伸缩icon的时候才允许伸缩
                return e.target.get('className') === 'collapse-icon'
              },
              // 伸缩状态发生改变
              onChange: function onChange(item, collapsed) {
                const icon = item.get('group').findByClassName('collapse-icon-num')
                icon.attr('text', collapsed ? item.getModel().children.length : '-')
              }
            },
            'zoom-canvas',
            'drag-canvas'
          ]
        },
        layout: data => {
          return Hierarchy.compactBox(data, {
            direction: 'LR',
            getId: function getId(d) {
              return d.id
            },
            getWidth: function getWidth() {
              return 243
            },
            getVGap: function getVGap() {
              return 24
            },
            getHGap: function getHGap() {
              return 50
            }
          })
        }
      })

      function formatData(data) {
        const recursiveTraverse = function recursiveTraverse(node, level) {
          const targetNode = {
            id: node.itemId + '',
            level: level,
            type: node.value,
            name: node.name,
            value: node.content,
            collapsed: level > 0,
            showDetail: false,
            origin: node,
            nodeHeight: NODE_HEIGHT
          }
          if (node.children) {
            targetNode.children = []
            node.children.forEach(function(item) {
              targetNode.children.push(recursiveTraverse(item, level + 1))
            })
          }
          return targetNode
        }
        return recursiveTraverse(data, 0)
      }
      setTimeout(() => {
        const data = formatData(this.tree)
        console.log(data)
        debugger
        graph.data(data)
        graph.render()
        graph.fitView()
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
