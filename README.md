# canvas-genshin-maps

超级丝滑的原神地图，基于 canvas2d，全新实现的地图手势识别及渲染，可在手机浏览器下提供接近原生地图的体验。

这个项目是我做的一个实验，背景是，早之前我已经用 flutter 实现了一版原神地图 app（https://github.com/qiuxiang/genshin-maps ），
惊讶于 flutter web 可以在浏览器上实现原生地图般丝滑的体验。然后就思考，类似的渲染逻辑用 js + canvas2d 实现，
能不能做到 flutter web 般丝滑？于是便写了这个项目。

从结果来看，js + canvas2d 也能实现流畅的地图使用体验，但和 flutter web 相比存在性能差距，主要体现在：
- 拖动、缩放地图触发 tile 加载渲染的时候 js 版更容易掉帧（设备性能够强的时候不会感受到）。
- js 版同时渲染超过 1k 个标记就开始明显掉帧，而 flutter 版保守估计能同时渲染 10k 个而不掉帧。

然后我也尝试探究了 js 版性能不如 flutter 版的原因：
- 最主要性能差距来自于 canvas2d 与 canvaskit（flutter web 的渲染引擎）。
  canvas2d 只能用有限的几个接口且没有优化空间，而 canvaskit 通过 webgl 重新实现了一套性能更好更丰富 2d 渲染接口。
  一个例子是渲染大量标记时，canvas2d 只能循环调用 drawImage，而 canvaskit 有 drawAtlas 可以高效率地渲染重复图片。
- js 版 tile 加载渲染更容易掉帧大概是因为地图渲染压力较大造成的，尽管 js canvas2d 加载渲染图片的流程和 flutter
  区别非常大，但从根本上来说，最耗时的应该是图片解码，而 flutter web 的图片解码基本可以确定用的浏览器接口，不存在差距。
  虽然现在 js 版的图片加载和 flutter 版是不一样的，但我也曾做过一些尝试，包括队列化图片加载、用 OfflineCanvas
  异步解码，都无法消除差异。

既然主要的差距来自于 canvas2d 与 webgl，那么用基于 webgl 的图形库来实现地图渲染是不是可以追平甚至超越 flutter web？
我会觉得是可以的，flutter web 的优势是 canvaskit，dart 代码会被编译成 js 运行，真正存在差异的只是渲染引擎而已。
