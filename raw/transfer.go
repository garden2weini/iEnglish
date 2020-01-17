package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

//定义在函数外部的变量是全局变量
//全局变量在任何地方都能使用
var curBook string      //全局变量
var curChapter *Chapter //全局变量
var chapters []Chapter
var curContents = []Content{}

//var contents []Content
var uidIndex int16

type Chapter struct {
	ChapterID int       `json:"chapter,int"`
	Name      string    `json:"name,string"`
	Contents  []Content `json:"contents"`
}
type Content struct {
	UID int16 `json:"uid,int16"`
	//ChapterID int    `json:"chapter_id,int"`
	Content string `json:"content,string"`
}

func processLine(line []byte) {
	txt := string(line[:])
	txt = strings.Replace(txt, "\n", "", -1)

	if strings.Index(txt, "#") == 0 {
		fmt.Println("Title...:" + txt)
		return
	}
	head := txt[0:1]
	if IsNumeric(head) {
		if curChapter != nil {
			//fmt.Println("[Chapter]:" + curChapter.Name)
			//fmt.Println(curChapter.Contents)
			chapters = append(chapters, *curChapter)
		}
		curChapter = &Chapter{}

		n, _ := strconv.Atoi(head)
		curChapter.ChapterID = n
		curChapter.Name = txt
	} else {
		content := &Content{}
		content.UID = uidIndex
		content.Content = txt
		if curChapter.Contents == nil {
			curChapter.Contents = []Content{}
		}
		curChapter.Contents = append(curChapter.Contents, *content)
		uidIndex++
	}
}

// 按照微信云存储风格构造Json
// NOTE:数组的每个元素分别json转string
func main() {
	books := map[string]string{
		"7-1": "Walrus Joins In",
		"7-2": "Noisy Neibours",
		"7-3": "Princess Pip's Holiday",
	}
	for k, _ := range books {
		chapters = chapters[0:0]
		uidIndex = 1
		curBook = k + ".json"
		//v = strings.Replace(v, " ", "-", -1) + ".txt"
		fileName := k + ".txt"
		clearOldFile(curBook)
		//fmt.Printf("k:[%v].v:[%v]\n", k, fileName) // 输出k,v值
		ReadLine(fileName, processLine)
		// 添加最后一个章节的内容
		chapters = append(chapters, *curChapter)
		result := ""
		for i := 0; i < len(chapters); i++ {
			data, _ := json.Marshal(chapters[i])
			result = result + string(data)
		}

		//fmt.Println(string(data))
		//data, _ = json.Marshal(contents)
		//result = result + string(data)
		result = strings.Replace(result, "\\\"", "", -1)
		//result = strings.Replace(result, "[", "", -1)
		//result = strings.Replace(result, "]", "", -1)
		//result = strings.Replace(result, "},", "}", -1)
		WriteWithIo(curBook, result)
	}

}
