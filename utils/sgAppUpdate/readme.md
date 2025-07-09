# APP版本更新、强制更新、IOS更新、wgt更新

### 使用方法
1、需要在移动中台注册应用，并优先上传apk和ipa,应用宝上传完成后在上传wgt发起热更新
2、在app.vue里引用 import APPUpdate from '@/uni_modules/sgAppUpdate/js_sdk/appUpdate'
然后直接调用
		``
			// #ifdef APP-PLUS
			APPUpdate();
			// #endif
		``
3、本地测试需要把uni_modules/sgAppUpdate/componentConfig  appID配置成自己的应用id