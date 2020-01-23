package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

//定义在函数外部的变量是全局变量
//全局变量在任何地方都能使用
var curBookNum string   //全局变量
var curChapter *Chapter //全局变量
var chapters []Chapter
var curContents = []Content{}

//var contents []Content
var uidIndex int16

type Chapter struct {
	ChapterID int       `json:"chapter,int"`
	Name      string    `json:"name,string"`
	BookName  string    `json:"book,int"`
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
		curChapter.BookName = curBookNum
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
// NOTE:新添加云存储的表时，确认其访问权限，否则小程序读不出数据
// NOTE:数组的每个元素分别json转string
// NOTE:TXT文件格式UTF-8/LF
func main() {
	books := map[string]string{
		"7-1": "Walrus Joins In",
		"7-2": "Noisy Neibours",
		"7-3": "Princess Pip's Holiday",
		"7-4": "Oh Otto!", "7-5": "Captain Comet and The Purple Planet",
		// "7-6": "Jungle Shorts", "7-7": "The Masked Cleaning Ladies of Om",
		//"7-8": "The Masked Cleaning Ladies Save the Day", "7-9": "The Masked Cleaning Ladies Meet the Pirates", "7-10": "Jellyfish Shoes", "7-11": "The Boss Dog of Blossom Street",
		//"7-12": "Cornflake Coin", "7-13": "The Ghost Ship", "7-14": "Micro the Metal Dog", "7-15": "The King of Football",
		//"7-16": "Arctic Hero", "7-17": "Pioneer Gir!", "7-18": "My Friend, Mandela",
	}
	buildMultiJsons(books)
	//buildAllInOneJson(books)
}

func buildAllInOneJson(books map[string]string) {
	outputFile := "./json/all_in_one.json"
	clearOldFile(outputFile)
	for k, _ := range books {
		chapters = chapters[0:0]
		uidIndex = 1
		curBookNum = k
		//v = strings.Replace(v, " ", "-", -1) + ".txt"
		fileName := k + ".txt"

		//fmt.Printf("k:[%v].v:[%v]\n", k, fileName) // 输出k,v值
		ReadLine(fileName, processLine)
		// 添加最后一个章节的内容
		chapters = append(chapters, *curChapter)
		result := ""
		for i := 0; i < len(chapters); i++ {
			data, _ := json.Marshal(chapters[i])
			result = result + string(data)
		}

		result = strings.Replace(result, "\\\"", "", -1)
		WriteWithIo(outputFile, result)
		// 清空缓存
		curChapter = nil
	}
}

func buildMultiJsons(books map[string]string) {

	for k, _ := range books {
		chapters = chapters[0:0]
		uidIndex = 1
		curBook := "./json/" + k + ".json"
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
		//result = strings.Replace(result, "\\r,", "", -1)
		//result = strings.Replace(result, "[", "", -1)
		//result = strings.Replace(result, "]", "", -1)
		//result = strings.Replace(result, "},", "}", -1)
		WriteWithIo(curBook, result)
		// 清空缓存
		curChapter = nil
	}
}
