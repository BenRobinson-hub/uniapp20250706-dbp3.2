<template>
	<view class="pt-24 pr-20 pl-20">
		<view v-for="item in cardList" :key="item.id" class="rd-16rpx mb-20 overflow">
			<tui-swipe-action :actions="actions" :forbid="item.status != 2 && item.write_surplus_times > 0" @click="handlerButton(item, $event)">
				<template v-slot:content>
					<view :style="[cardBackground(item)]" @click="goCard(item)">
						<view :style="[cardMask(item)]" class="flex h-206 pr-24 pl-32 pt-50 fs-24 text--w111-fff">
							<view class="relative w-104 h-104 rd-50-p111- overflow">
								<image :src="item.image" mode="" class="w-full h-full"></image>
								<view v-if="item.status == 2" class="abs-lt flex-center w-full h-full bg-w111-000-s111-50">已过期</view>
							</view>
							<view class="flex-1 min-w-0 pr-24 pl-24">
								<view class="fw-500 fs-32 line1">{{ item.card_name }}</view>
								<view class="mt-18 break_word" v-if="item.write_valid == 1">有效期：永久有效</view>
								<view class="mt-18 break_word" v-else-if="item.write_valid == 2">有效期至：{{ item.write_end }}</view>
								<view class="mt-18 break_word" v-else-if="item.write_valid == 3">有效期：{{ item.write_start }}至{{ item.write_end }}</view>
							</view>
							<view class="">
								<view class="text-right">
									<text class="iconfont icon-ic_QRcode fs-40"></text>
								</view>
								<view class="mt-16" v-if="item.write_surplus_times">剩余{{ item.write_surplus_times }}次</view>
								<view class="mt-16" v-else>核销完成</view>
							</view>
						</view>
					</view>
				</template>
			</tui-swipe-action>
		</view>
		<emptyPage v-if="loadend && !cardList.length" title="暂无卡包信息" src="/statics/images/noCollection.gif"></emptyPage>
		<view class="pb-safe"></view>
	</view>
</template>

<script>
	import tuiSwipeAction from '@/components/tui-swipe-action/index.vue';
	import emptyPage from '@/components/emptyPage.vue';
	import {
		HTTP_REQUEST_URL
	} from '@/config/app.js';
	import {
		userCardList,
		delCardHolder
	} from '@/api/user.js';

	export default {
		components: {
			tuiSwipeAction,
			emptyPage,
		},
		data() {
			return {
				actions: [{
					name: '删除',
					color: '#FFFFFF',
					fontsize: 24, //单位rpx
					width: 60, //单位px
					background: '#E93323'
				}],
				cardList: [],
				loadend: false,
			}
		},
		onLoad() {
			this.getCardList();
		},
		methods: {
			cardBackground(item) {
				if (item.product_type == 4 || item.card_cover == 1) {
					return {
						'background': `url(${item.product_type == 4 ? `${HTTP_REQUEST_URL}/statics/images/card_cover_image.png` : item.card_cover_image}) center/cover no-repeat`,
					}
				} else {
					return {
						'background-color': item.card_cover_color
					}
				}
			},
			cardMask(item) {
				return {
					'background-color': item.status == 2 ? 'rgba(187, 187, 187, 0.8)' : 'rgba(0, 0, 0, 0.3)'
				}
			},
			getCardList() {
				userCardList().then((res) => {
					this.loadend = true;
					this.cardList = res.data;
				}).catch(() => {
					this.loadend = true;
				});
			},
			handlerButton(item, e) {
				if (item.status == 1 && item.write_surplus_times) {
					return this.$util.Tips({
						title: `剩余${item.write_surplus_times}次未核销，请全部核销后删除`,
					});
				}
				if (e.index == 0) {
					delCardHolder(item.id).then((res) => {
						this.$util.Tips({
							title: res.msg,
							icon: 'success'
						}, this.getCardList);
					})
				}
			},
			goCard(item) {
				uni.navigateTo({
					url: `/pages/users/user_card/index?id=${item.id}`
				})
			}
		},
	};
</script>

<style lang="scss" scoped>
	.card-mask {
		background-color: rgba(0, 0, 0, 0.3);
	}
</style>