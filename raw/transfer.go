package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

//定义在函数外部的变量是全局变量
//全局变量在任何地方都能使用
var curBook string //全局变量
var curChapter = 1 //全局变量
var chapters []Chapter
var contents []Content
var uidIndex int16

type Chapter struct {
	ChapterID int    `json:"chapter,int"`
	Content   string `json:"name,string"`
}
type Content struct {
	UID       int16  `json:"uid,int16"`
	ChapterID int    `json:"chapter,int"`
	Content   string `json:"content,string"`
}

func processLine(line []byte) {
	txt := string(line[:])
	txt = strings.Replace(txt, "\n", "", -1)
	//txt = strings.Replace(txt, "\"", "", -1)

	head := txt[0:1]
	if IsNumeric(head) {
		chapter := &Chapter{}
		n, _ := strconv.Atoi(head)
		chapter.ChapterID = n
		curChapter = n
		chapter.Content = txt
		chapters = append(chapters, *chapter)
	} else {
		content := &Content{}
		content.UID = uidIndex
		content.ChapterID = curChapter
		content.Content = txt
		contents = append(contents, *content)
		uidIndex++
	}

}

func main() {
	books := map[string]string{
		"7-2": "Noisy Neibours",
	}
	for k, v := range books {
		chapters = chapters[0:0]
		uidIndex = 1
		curBook = k + ".json"
		v = strings.Replace(v, " ", "-", -1) + ".txt"
		fmt.Printf("k:[%v].v:[%v]\n", k, v) // 输出k,v值
		ReadLine(v, processLine)

		data, _ := json.Marshal(chapters)
		result := string(data)
		//fmt.Println(string(data))
		data, _ = json.Marshal(contents)
		result = result + string(data)
		result = strings.Replace(result, "\\\"", "", -1)
		result = strings.Replace(result, "[", "", -1)
		result = strings.Replace(result, "]", "", -1)
		result = strings.Replace(result, "},", "}", -1)
		WriteWithIo(curBook, result)
	}

}
