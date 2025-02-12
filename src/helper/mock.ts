import { randomInt, randomPick } from "@zuoque/random-coding/tools"

export const mock = {
    /**
     * 生成随机姓名
     * @param sex 性别
     */
    cname: function (sex?: 1|0|"男"|"女") {
        const surname = this.pick(STATIC_DATA.surname);
        let names = [];
        if (sex === 1 || sex === "男") {
            names = STATIC_DATA.names.manName
        } else if (sex === 0 || sex === "女") {
            names = STATIC_DATA.names.galName
        } else {
            names = [
                ...STATIC_DATA.names.manName,
                ...STATIC_DATA.names.galName
            ]
        }
        const name = this.pick(names);
        return `${surname}${name}`
    },

    /**
     * 生成随机整数
     * @param min
     * @param max
     */
    natural: function (min?: number, max?: number) {
        if (min === undefined && max === undefined) {
            return randomInt()
        } else if (min !== undefined && max === undefined) {
            return randomInt(min)
        } else {
            return randomInt(min || 0, max!);
        }
    },

    /**
     * 生成随机长度的汉字
     * @param min 最小长度
     * @param max 最大长度
     */
    cword: function(min?: number, max?: number) {
        min = min || 1
        max = max || STATIC_DATA.hanZi.length;

        if (min > max) {
            const realMax = min;
            min = max;
            max = realMax;
        }

        const len = this.natural(min, max);
        let word = "";
        while (word.length < len) {
            word += this.pick(STATIC_DATA.hanZi);
        }

        return word;
    },

    /**
     * 从数组中随机取一个元素
     * @param list
     */
    pick: function <T>(list: ArrayLike<T>): T {
        return randomPick(list)!
    }

}



// 静态数据集
const STATIC_DATA = {
    surname: ["王","李","张","刘","陈","杨","赵","黄","周","吴","徐","孙","胡","朱","高","林","何","郭","马","罗","梁","宋","郑","谢","韩","唐","冯","于","董","萧","程","曹","袁","邓","许","傅","沈","曾","彭","吕","苏","卢","蒋","蔡","贾","丁","魏","薛","叶","阎","余","潘","杜","戴","夏","锺","汪","田","任","姜","范","方","石","姚","谭","廖","邹","熊","金","陆","郝","孔","白","崔","康","毛","邱","秦","江","史","顾","侯","邵","孟","龙","万","段","雷","钱","汤","尹","黎","易","常","武","乔","贺","赖","龚","文","诸葛","东方","司马","欧阳","上官","宇文","皇甫","端木","赫连","公孙","长孙","司徒","尉迟","淳于"],
    names: {
        galName: ["丽","娜","美","颖","婷","芳","芬","莉","娟","艳","梅","琳","璐","蕾","茜","燕","蓉","薇","菲","雯","诗涵","欣怡","雅静","梓萱","瑾萱","雨彤","梓涵","欣妍","婧琪","语嫣","若彤","梦璐","思颖","雅琪","芷若","可馨","雨婷","雅雯","子墨","若曦","芷琪","梦琪","雨欣","佳怡","思涵","梓萱","瑾萱","语彤","婧怡","雨萌","梦洁","梓琪","欣妍","婧怡","雨菲"],
        manName: ["伟","杰","强","磊","勇","飞","刚","军","平","宁","超","波","洋","浩","宇","亮","明","东","海","晨","子轩","浩然","宇轩","俊杰","子涵","文博","天佑","煜城","鹏飞","俊驰","鸿涛","子墨","俊逸","文轩","弘文","子骞","昊然","泽宇","思远","子默","浩然","子轩","宇轩","俊杰","子默","泽洋","煜祺","文昊","宇辰","天磊","子墨","俊哲","宇航","文杰","天宇"]
    },
    hanZi: '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞',
}