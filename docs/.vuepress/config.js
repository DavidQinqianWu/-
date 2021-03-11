// 注意: base的值为github仓库的名称
module.exports = {
	base: "/interview/" /* 基础虚拟路径: */, // 注意 要有   '/XXX/' XXX 是你的github 上的项目名称
	dest: "dist" /* 打包文件基础路径, 在命令所在目录下 */,
	title: "面试总结学习", // 标题
	description: "每天记录一些学习的关于面试的新知识", // 标题下的描述
	markdown: {
		lineNumbers: true,
		externalLinks: { target: "_blank", rel: "noopener noreferrer" },
	},
	configureWebpack: {
		resolve: {
			alias: {
				"@alias": "docs/.vuepress/public",
			},
		},
	},
	themeConfig: {
		sidebar: "auto",
		nav: [
			{ text: "主页", link: "/" },
			{ text: "CSS 类型", link: "/CSS/" },
			{
				text: "网络与浏览器",
				items: [
					{ text: "网络", link: "/网络/" },
					{ text: "浏览器", link: "/浏览器/" },
				],
			},

			{
				text: "js/ts",
				items: [
					{ text: "js", link: "/language/js.md" },
					{ text: "ts", link: "/language/ts.md" },
				],
			},
			{ text: "算法", link: "/algorithm/" },
			{
				text: "框架",
				items: [
					{ text: "vue", link: "/frame/vue.md" },
					{ text: "react", link: "/frame/react.md" },
				],
			},
		],
	},
};
