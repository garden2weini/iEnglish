<template>
    <!-- 可作为备份的系统初始化工具：-->
    <!-- 1. 将各本书各语句的合成语音保存到wx cloud存储 -->
    <view>
        <h1>Startup...</h1>
        <view class="uni-title uni-common-pl">书籍选择</view>
        <view class="uni-list">
            <view class="uni-list-cell">
                <view class="uni-list-cell-left">当前选择</view>
                <view class="uni-list-cell-db">
                    <picker @change="bindPickerChange" :value="bookIndex" :range="bookArray">
                        <view class="uni-input">{{ bookArray[bookIndex] }}</view>
                    </picker>
                    <button @click="bookButtonClick" type="primary" plain="true">下载文字合成语音文件</button>
                </view>
            </view>
        </view>
        
    </view>
    
</template>

<script>
import book from '@/common/js/book.js';
export default {
    components: {},
    data() {
        return {
            bookArray: ['7-1', '7-2', '7-3', '7-4', '7-5'],
            bookIndex: 0,
            curBook: null,
            chapters: null, // 当前图书章节及内容，从数据库中读取json数据
            chapterIndex: -1,
            contentIndex: -1,
            storyContent: '',
            innerAudioContext: uni.createInnerAudioContext()
        };
    },
    methods: {
        bindPickerChange: function(e) {
            //console.log('picker发送选择改变，携带值为', e.target.value);
            this.bookIndex = e.target.value;
        },
        bookButtonClick() {
            this.curBook = this.bookArray[this.bookIndex]; //'7-3';
            this.getChapters(this.curBook);
        },
        getChapters(bookTable) {
            // 获取章节列表
            var self = this;
            // 1. 获取数据库引用
            let db = wx.cloud.database({
                env: this.Database
            });
            console.log('...' + bookTable);
            // 2. 构造查询语句(NOTE:每次只能获取20条记录)
            db.collection(bookTable)
                .where({
                    //
                })
                .field({
                    //
                })
                .orderBy('chapter', 'asc')
                .get({
                    success: function(res) {
                        self.chapters = res.data;
                        console.log(self.chapters);
                        self.initBook();
                    }
                });
        },
        initBook() {
            // NOTE: 获取到章节及内容后，进行初始化逻辑
            this.chapterIndex = 0;
            this.contentIndex = -1;
            var gap = 0;

            while (true) {
                // 死循环，一直的执行while语句
                let chapterLen = this.chapters.length;
                let curContents = this.chapters[this.chapterIndex];
                let contentLen = this.chapters[this.chapterIndex].contents.length;

                if (this.contentIndex === contentLen - 1) {
                    if (this.chapterIndex === chapterLen - 1) {
                        break;
                    } else {
                        this.chapterIndex++;
                        this.contentIndex = 0;
                    }
                } else {
                    this.contentIndex++;
                }
                this.curChapterName = this.chapters[this.chapterIndex].name;
                this.storyContent = this.chapters[this.chapterIndex].contents[this.contentIndex].content;
                //console.log('Content:' + this.storyContent);

                // 每次原文语句更新都重新构造新的语音合成url，并赋值给播放器. 百度合成语音先保存到本地，再关联播放组件
                var tmpFile = this.FileName(this.curBook, this.chapterIndex, this.contentIndex);

                // 设置调用间隔，保证调用百度API QPS为2.
                setTimeout(book.buildAudioSrc, gap*500, this.storyContent, this.innerAudioContext, this.CloudRoot, tmpFile);
                gap++;
                //book.buildAudioSrc(this.storyContent, this.innerAudioContext, this.CloudRoot, tmpFile);
            }
        },
        
    },
    onLoad(e) {
        
    }
};
</script>

<style scoped></style>
