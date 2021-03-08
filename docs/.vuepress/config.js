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
	themeConfig: {
		sidebar: "auto",
		nav: [
			{ text: "主页", link: "/" },
			{ text: "CSS 类型", link: "/CSS/" },
			{ text: "网络与浏览器", link: "/网络与浏览器/" },
			{
				text: "学习",
				items: [
					{ text: "英语", link: "/study/english/english01" },
					{ text: "数学", link: "/study/math/math01" },
				],
			},
		],
	},
};
