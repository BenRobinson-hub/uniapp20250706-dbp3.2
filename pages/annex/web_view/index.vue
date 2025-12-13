<template>
	<web-view class="web-view" @message="saoma" :webview-styles="webviewStyles" :src="url" :style="{width: windowW + 'px', height: windowH + 'px'}"></web-view>
</template>

<script>
	import $store from "@/store";
	export default {
		data() {
			return {
				windowH: 0,
				windowW: 0,
				webviewStyles: {
					progress: {
						color: 'transparent'
					}
				},
				url: ''
			}
		},
		onLoad(option) {
			console.log(option);
			//this.url = decodeURIComponent(option.url);
			if (option.q) {
				this.url = decodeURIComponent(option.q + "&_SESSION_=" + $store.state.app.token)+"&vconsole=1&debug=1";
			}
			if (option.url) {
				if (decodeURIComponent(option.url).indexOf("?") != -1) {
					this.url = decodeURIComponent(option.url + "&_SESSION_=" + $store.state.app.token)+"&vconsole=1&debug=1";
				} else {
					this.url = decodeURIComponent(option.url + "?_SESSION_=" + $store.state.app.token)+"&vconsole=1&debug=1";
				}
				//this.url="https://qimai.naturecare.top/qimai_biz/newPhone.aspx?_SESSION_="+$store.state.app.token+"&url="+option.url
			}
			console.log(this.url);
			try {
				const res = uni.getSystemInfoSync();
				this.windowW = res.windowWidth;
				this.windowH = res.windowHeight;
			} catch (e) {
				// error
			}
		},
		// 监听导航栏按钮点击
		onNavigationBarButtonTap(e) {
			if (e.index === 0) { // 第一个按钮
				this.backToHome();
			}
		},
		methods: {
			// 返回主页
			backToHome() {
				uni.reLaunch({
					url: '/pages/index/index' // 替换为实际主页路径
				});
			},
		
			// 接收WebView消息
			// onWebViewMessage(e) {
			// 	console.log('收到H5消息:', e.detail);
			// },
			toJSON: function(){ return this},
			saoma(event){
				//判断是否监听到消息
				if(event.detail.data[0].action == "Scan_Code"){
					// #ifdef APP-PLUS
					//获取当前页面的webview对象
					let currentWebview = this.$scope.$getAppWebview()
					let wv = currentWebview.children()[0];
					console.log(wv);
					// #endif
					uni.scanCode({
						onlyFromCamera:false,
						scanType:['qrCode'],
						success:function(res){
							//传回给h5
							wv.evalJS(`appScanCodeResult(${JSON.stringify(res)})`) 
						}
					})
				}				
			} 
		},
		// 监听导航栏返回按钮
		onBackPress() {
			// 可以在这里添加返回确认逻辑
			return false;
		}
	}
</script>

