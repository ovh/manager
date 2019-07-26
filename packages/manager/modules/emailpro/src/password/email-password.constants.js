/*
 * The follwing is a list of ranges between which code points fit in a given category
 * as unicode code points.
 * They were derived by iterating through the values 0 to 1,114,111 and asking the
 * java.lang.Character class if they were into the appropriate category
 *
 * Microsoft considers an EmailPro password strong enough when it has elements
 * from 3 out of 5 of those groups
 */

// Uppercase characters of European languages
// (A through Z, with diacritic marks, Greek and Cyrillic characters)
export const UPPERCASE = [
  [65, 90],
  [192, 214],
  [216, 222],
  [256, 256],
  [258, 258],
  [260, 260],
  [262, 262],
  [264, 264],
  [266, 266],
  [268, 268],
  [270, 270],
  [272, 272],
  [274, 274],
  [276, 276],
  [278, 278],
  [280, 280],
  [282, 282],
  [284, 284],
  [286, 286],
  [288, 288],
  [290, 290],
  [292, 292],
  [294, 294],
  [296, 296],
  [298, 298],
  [300, 300],
  [302, 302],
  [304, 304],
  [306, 306],
  [308, 308],
  [310, 310],
  [313, 313],
  [315, 315],
  [317, 317],
  [319, 319],
  [321, 321],
  [323, 323],
  [325, 325],
  [327, 327],
  [330, 330],
  [332, 332],
  [334, 334],
  [336, 336],
  [338, 338],
  [340, 340],
  [342, 342],
  [344, 344],
  [346, 346],
  [348, 348],
  [350, 350],
  [352, 352],
  [354, 354],
  [356, 356],
  [358, 358],
  [360, 360],
  [362, 362],
  [364, 364],
  [366, 366],
  [368, 368],
  [370, 370],
  [372, 372],
  [374, 374],
  [376, 377],
  [379, 379],
  [381, 381],
  [385, 386],
  [388, 388],
  [390, 391],
  [393, 395],
  [398, 401],
  [403, 404],
  [406, 408],
  [412, 413],
  [415, 416],
  [418, 418],
  [420, 420],
  [422, 423],
  [425, 425],
  [428, 428],
  [430, 431],
  [433, 435],
  [437, 437],
  [439, 440],
  [444, 444],
  [452, 452],
  [455, 455],
  [458, 458],
  [461, 461],
  [463, 463],
  [465, 465],
  [467, 467],
  [469, 469],
  [471, 471],
  [473, 473],
  [475, 475],
  [478, 478],
  [480, 480],
  [482, 482],
  [484, 484],
  [486, 486],
  [488, 488],
  [490, 490],
  [492, 492],
  [494, 494],
  [497, 497],
  [500, 500],
  [502, 504],
  [506, 506],
  [508, 508],
  [510, 510],
  [512, 512],
  [514, 514],
  [516, 516],
  [518, 518],
  [520, 520],
  [522, 522],
  [524, 524],
  [526, 526],
  [528, 528],
  [530, 530],
  [532, 532],
  [534, 534],
  [536, 536],
  [538, 538],
  [540, 540],
  [542, 542],
  [544, 544],
  [546, 546],
  [548, 548],
  [550, 550],
  [552, 552],
  [554, 554],
  [556, 556],
  [558, 558],
  [560, 560],
  [562, 562],
  [570, 571],
  [573, 574],
  [577, 577],
  [579, 582],
  [584, 584],
  [586, 586],
  [588, 588],
  [590, 590],
  [880, 880],
  [882, 882],
  [886, 886],
  [902, 902],
  [904, 906],
  [908, 908],
  [910, 911],
  [913, 929],
  [931, 939],
  [975, 975],
  [978, 980],
  [984, 984],
  [986, 986],
  [988, 988],
  [990, 990],
  [992, 992],
  [994, 994],
  [996, 996],
  [998, 998],
  [1000, 1000],
  [1002, 1002],
  [1004, 1004],
  [1006, 1006],
  [1012, 1012],
  [1015, 1015],
  [1017, 1018],
  [1021, 1071],
  [1120, 1120],
  [1122, 1122],
  [1124, 1124],
  [1126, 1126],
  [1128, 1128],
  [1130, 1130],
  [1132, 1132],
  [1134, 1134],
  [1136, 1136],
  [1138, 1138],
  [1140, 1140],
  [1142, 1142],
  [1144, 1144],
  [1146, 1146],
  [1148, 1148],
  [1150, 1150],
  [1152, 1152],
  [1162, 1162],
  [1164, 1164],
  [1166, 1166],
  [1168, 1168],
  [1170, 1170],
  [1172, 1172],
  [1174, 1174],
  [1176, 1176],
  [1178, 1178],
  [1180, 1180],
  [1182, 1182],
  [1184, 1184],
  [1186, 1186],
  [1188, 1188],
  [1190, 1190],
  [1192, 1192],
  [1194, 1194],
  [1196, 1196],
  [1198, 1198],
  [1200, 1200],
  [1202, 1202],
  [1204, 1204],
  [1206, 1206],
  [1208, 1208],
  [1210, 1210],
  [1212, 1212],
  [1214, 1214],
  [1216, 1217],
  [1219, 1219],
  [1221, 1221],
  [1223, 1223],
  [1225, 1225],
  [1227, 1227],
  [1229, 1229],
  [1232, 1232],
  [1234, 1234],
  [1236, 1236],
  [1238, 1238],
  [1240, 1240],
  [1242, 1242],
  [1244, 1244],
  [1246, 1246],
  [1248, 1248],
  [1250, 1250],
  [1252, 1252],
  [1254, 1254],
  [1256, 1256],
  [1258, 1258],
  [1260, 1260],
  [1262, 1262],
  [1264, 1264],
  [1266, 1266],
  [1268, 1268],
  [1270, 1270],
  [1272, 1272],
  [1274, 1274],
  [1276, 1276],
  [1278, 1278],
  [1280, 1280],
  [1282, 1282],
  [1284, 1284],
  [1286, 1286],
  [1288, 1288],
  [1290, 1290],
  [1292, 1292],
  [1294, 1294],
  [1296, 1296],
  [1298, 1298],
  [1300, 1300],
  [1302, 1302],
  [1304, 1304],
  [1306, 1306],
  [1308, 1308],
  [1310, 1310],
  [1312, 1312],
  [1314, 1314],
  [1316, 1316],
  [1318, 1318],
  [1329, 1366],
  [4256, 4293],
  [7680, 7680],
  [7682, 7682],
  [7684, 7684],
  [7686, 7686],
  [7688, 7688],
  [7690, 7690],
  [7692, 7692],
  [7694, 7694],
  [7696, 7696],
  [7698, 7698],
  [7700, 7700],
  [7702, 7702],
  [7704, 7704],
  [7706, 7706],
  [7708, 7708],
  [7710, 7710],
  [7712, 7712],
  [7714, 7714],
  [7716, 7716],
  [7718, 7718],
  [7720, 7720],
  [7722, 7722],
  [7724, 7724],
  [7726, 7726],
  [7728, 7728],
  [7730, 7730],
  [7732, 7732],
  [7734, 7734],
  [7736, 7736],
  [7738, 7738],
  [7740, 7740],
  [7742, 7742],
  [7744, 7744],
  [7746, 7746],
  [7748, 7748],
  [7750, 7750],
  [7752, 7752],
  [7754, 7754],
  [7756, 7756],
  [7758, 7758],
  [7760, 7760],
  [7762, 7762],
  [7764, 7764],
  [7766, 7766],
  [7768, 7768],
  [7770, 7770],
  [7772, 7772],
  [7774, 7774],
  [7776, 7776],
  [7778, 7778],
  [7780, 7780],
  [7782, 7782],
  [7784, 7784],
  [7786, 7786],
  [7788, 7788],
  [7790, 7790],
  [7792, 7792],
  [7794, 7794],
  [7796, 7796],
  [7798, 7798],
  [7800, 7800],
  [7802, 7802],
  [7804, 7804],
  [7806, 7806],
  [7808, 7808],
  [7810, 7810],
  [7812, 7812],
  [7814, 7814],
  [7816, 7816],
  [7818, 7818],
  [7820, 7820],
  [7822, 7822],
  [7824, 7824],
  [7826, 7826],
  [7828, 7828],
  [7838, 7838],
  [7840, 7840],
  [7842, 7842],
  [7844, 7844],
  [7846, 7846],
  [7848, 7848],
  [7850, 7850],
  [7852, 7852],
  [7854, 7854],
  [7856, 7856],
  [7858, 7858],
  [7860, 7860],
  [7862, 7862],
  [7864, 7864],
  [7866, 7866],
  [7868, 7868],
  [7870, 7870],
  [7872, 7872],
  [7874, 7874],
  [7876, 7876],
  [7878, 7878],
  [7880, 7880],
  [7882, 7882],
  [7884, 7884],
  [7886, 7886],
  [7888, 7888],
  [7890, 7890],
  [7892, 7892],
  [7894, 7894],
  [7896, 7896],
  [7898, 7898],
  [7900, 7900],
  [7902, 7902],
  [7904, 7904],
  [7906, 7906],
  [7908, 7908],
  [7910, 7910],
  [7912, 7912],
  [7914, 7914],
  [7916, 7916],
  [7918, 7918],
  [7920, 7920],
  [7922, 7922],
  [7924, 7924],
  [7926, 7926],
  [7928, 7928],
  [7930, 7930],
  [7932, 7932],
  [7934, 7934],
  [7944, 7951],
  [7960, 7965],
  [7976, 7983],
  [7992, 7999],
  [8008, 8013],
  [8025, 8025],
  [8027, 8027],
  [8029, 8029],
  [8031, 8031],
  [8040, 8047],
  [8120, 8123],
  [8136, 8139],
  [8152, 8155],
  [8168, 8172],
  [8184, 8187],
  [8450, 8450],
  [8455, 8455],
  [8459, 8461],
  [8464, 8466],
  [8469, 8469],
  [8473, 8477],
  [8484, 8484],
  [8486, 8486],
  [8488, 8488],
  [8490, 8493],
  [8496, 8499],
  [8510, 8511],
  [8517, 8517],
  [8544, 8559],
  [8579, 8579],
  [9398, 9423],
  [11264, 11310],
  [11360, 11360],
  [11362, 11364],
  [11367, 11367],
  [11369, 11369],
  [11371, 11371],
  [11373, 11376],
  [11378, 11378],
  [11381, 11381],
  [11390, 11392],
  [11394, 11394],
  [11396, 11396],
  [11398, 11398],
  [11400, 11400],
  [11402, 11402],
  [11404, 11404],
  [11406, 11406],
  [11408, 11408],
  [11410, 11410],
  [11412, 11412],
  [11414, 11414],
  [11416, 11416],
  [11418, 11418],
  [11420, 11420],
  [11422, 11422],
  [11424, 11424],
  [11426, 11426],
  [11428, 11428],
  [11430, 11430],
  [11432, 11432],
  [11434, 11434],
  [11436, 11436],
  [11438, 11438],
  [11440, 11440],
  [11442, 11442],
  [11444, 11444],
  [11446, 11446],
  [11448, 11448],
  [11450, 11450],
  [11452, 11452],
  [11454, 11454],
  [11456, 11456],
  [11458, 11458],
  [11460, 11460],
  [11462, 11462],
  [11464, 11464],
  [11466, 11466],
  [11468, 11468],
  [11470, 11470],
  [11472, 11472],
  [11474, 11474],
  [11476, 11476],
  [11478, 11478],
  [11480, 11480],
  [11482, 11482],
  [11484, 11484],
  [11486, 11486],
  [11488, 11488],
  [11490, 11490],
  [11499, 11499],
  [11501, 11501],
  [42560, 42560],
  [42562, 42562],
  [42564, 42564],
  [42566, 42566],
  [42568, 42568],
  [42570, 42570],
  [42572, 42572],
  [42574, 42574],
  [42576, 42576],
  [42578, 42578],
  [42580, 42580],
  [42582, 42582],
  [42584, 42584],
  [42586, 42586],
  [42588, 42588],
  [42590, 42590],
  [42592, 42592],
  [42594, 42594],
  [42596, 42596],
  [42598, 42598],
  [42600, 42600],
  [42602, 42602],
  [42604, 42604],
  [42624, 42624],
  [42626, 42626],
  [42628, 42628],
  [42630, 42630],
  [42632, 42632],
  [42634, 42634],
  [42636, 42636],
  [42638, 42638],
  [42640, 42640],
  [42642, 42642],
  [42644, 42644],
  [42646, 42646],
  [42786, 42786],
  [42788, 42788],
  [42790, 42790],
  [42792, 42792],
  [42794, 42794],
  [42796, 42796],
  [42798, 42798],
  [42802, 42802],
  [42804, 42804],
  [42806, 42806],
  [42808, 42808],
  [42810, 42810],
  [42812, 42812],
  [42814, 42814],
  [42816, 42816],
  [42818, 42818],
  [42820, 42820],
  [42822, 42822],
  [42824, 42824],
  [42826, 42826],
  [42828, 42828],
  [42830, 42830],
  [42832, 42832],
  [42834, 42834],
  [42836, 42836],
  [42838, 42838],
  [42840, 42840],
  [42842, 42842],
  [42844, 42844],
  [42846, 42846],
  [42848, 42848],
  [42850, 42850],
  [42852, 42852],
  [42854, 42854],
  [42856, 42856],
  [42858, 42858],
  [42860, 42860],
  [42862, 42862],
  [42873, 42873],
  [42875, 42875],
  [42877, 42878],
  [42880, 42880],
  [42882, 42882],
  [42884, 42884],
  [42886, 42886],
  [42891, 42891],
  [42893, 42893],
  [42896, 42896],
  [42912, 42912],
  [42914, 42914],
  [42916, 42916],
  [42918, 42918],
  [42920, 42920],
  [65313, 65338],
  [66560, 66599],
  [119808, 119833],
  [119860, 119885],
  [119912, 119937],
  [119964, 119964],
  [119966, 119967],
  [119970, 119970],
  [119973, 119974],
  [119977, 119980],
  [119982, 119989],
  [120016, 120041],
  [120068, 120069],
  [120071, 120074],
  [120077, 120084],
  [120086, 120092],
  [120120, 120121],
  [120123, 120126],
  [120128, 120132],
  [120134, 120134],
  [120138, 120144],
  [120172, 120197],
  [120224, 120249],
  [120276, 120301],
  [120328, 120353],
  [120380, 120405],
  [120432, 120457],
  [120488, 120512],
  [120546, 120570],
  [120604, 120628],
  [120662, 120686],
  [120720, 120744],
  [120778, 120778],
];

// Lowercase characters of European languages
// (a through z, sharp - s, with diacritic marks, Greek and Cyrillic characters)
export const LOWERCASE = [
  [97, 122],
  [170, 170],
  [181, 181],
  [186, 186],
  [223, 246],
  [248, 255],
  [257, 257],
  [259, 259],
  [261, 261],
  [263, 263],
  [265, 265],
  [267, 267],
  [269, 269],
  [271, 271],
  [273, 273],
  [275, 275],
  [277, 277],
  [279, 279],
  [281, 281],
  [283, 283],
  [285, 285],
  [287, 287],
  [289, 289],
  [291, 291],
  [293, 293],
  [295, 295],
  [297, 297],
  [299, 299],
  [301, 301],
  [303, 303],
  [305, 305],
  [307, 307],
  [309, 309],
  [311, 312],
  [314, 314],
  [316, 316],
  [318, 318],
  [320, 320],
  [322, 322],
  [324, 324],
  [326, 326],
  [328, 329],
  [331, 331],
  [333, 333],
  [335, 335],
  [337, 337],
  [339, 339],
  [341, 341],
  [343, 343],
  [345, 345],
  [347, 347],
  [349, 349],
  [351, 351],
  [353, 353],
  [355, 355],
  [357, 357],
  [359, 359],
  [361, 361],
  [363, 363],
  [365, 365],
  [367, 367],
  [369, 369],
  [371, 371],
  [373, 373],
  [375, 375],
  [378, 378],
  [380, 380],
  [382, 384],
  [387, 387],
  [389, 389],
  [392, 392],
  [396, 397],
  [402, 402],
  [405, 405],
  [409, 411],
  [414, 414],
  [417, 417],
  [419, 419],
  [421, 421],
  [424, 424],
  [426, 427],
  [429, 429],
  [432, 432],
  [436, 436],
  [438, 438],
  [441, 442],
  [445, 447],
  [454, 454],
  [457, 457],
  [460, 460],
  [462, 462],
  [464, 464],
  [466, 466],
  [468, 468],
  [470, 470],
  [472, 472],
  [474, 474],
  [476, 477],
  [479, 479],
  [481, 481],
  [483, 483],
  [485, 485],
  [487, 487],
  [489, 489],
  [491, 491],
  [493, 493],
  [495, 496],
  [499, 499],
  [501, 501],
  [505, 505],
  [507, 507],
  [509, 509],
  [511, 511],
  [513, 513],
  [515, 515],
  [517, 517],
  [519, 519],
  [521, 521],
  [523, 523],
  [525, 525],
  [527, 527],
  [529, 529],
  [531, 531],
  [533, 533],
  [535, 535],
  [537, 537],
  [539, 539],
  [541, 541],
  [543, 543],
  [545, 545],
  [547, 547],
  [549, 549],
  [551, 551],
  [553, 553],
  [555, 555],
  [557, 557],
  [559, 559],
  [561, 561],
  [563, 569],
  [572, 572],
  [575, 576],
  [578, 578],
  [583, 583],
  [585, 585],
  [587, 587],
  [589, 589],
  [591, 659],
  [661, 696],
  [704, 705],
  [736, 740],
  [837, 837],
  [881, 881],
  [883, 883],
  [887, 887],
  [890, 893],
  [912, 912],
  [940, 974],
  [976, 977],
  [981, 983],
  [985, 985],
  [987, 987],
  [989, 989],
  [991, 991],
  [993, 993],
  [995, 995],
  [997, 997],
  [999, 999],
  [1001, 1001],
  [1003, 1003],
  [1005, 1005],
  [1007, 1011],
  [1013, 1013],
  [1016, 1016],
  [1019, 1020],
  [1072, 1119],
  [1121, 1121],
  [1123, 1123],
  [1125, 1125],
  [1127, 1127],
  [1129, 1129],
  [1131, 1131],
  [1133, 1133],
  [1135, 1135],
  [1137, 1137],
  [1139, 1139],
  [1141, 1141],
  [1143, 1143],
  [1145, 1145],
  [1147, 1147],
  [1149, 1149],
  [1151, 1151],
  [1153, 1153],
  [1163, 1163],
  [1165, 1165],
  [1167, 1167],
  [1169, 1169],
  [1171, 1171],
  [1173, 1173],
  [1175, 1175],
  [1177, 1177],
  [1179, 1179],
  [1181, 1181],
  [1183, 1183],
  [1185, 1185],
  [1187, 1187],
  [1189, 1189],
  [1191, 1191],
  [1193, 1193],
  [1195, 1195],
  [1197, 1197],
  [1199, 1199],
  [1201, 1201],
  [1203, 1203],
  [1205, 1205],
  [1207, 1207],
  [1209, 1209],
  [1211, 1211],
  [1213, 1213],
  [1215, 1215],
  [1218, 1218],
  [1220, 1220],
  [1222, 1222],
  [1224, 1224],
  [1226, 1226],
  [1228, 1228],
  [1230, 1231],
  [1233, 1233],
  [1235, 1235],
  [1237, 1237],
  [1239, 1239],
  [1241, 1241],
  [1243, 1243],
  [1245, 1245],
  [1247, 1247],
  [1249, 1249],
  [1251, 1251],
  [1253, 1253],
  [1255, 1255],
  [1257, 1257],
  [1259, 1259],
  [1261, 1261],
  [1263, 1263],
  [1265, 1265],
  [1267, 1267],
  [1269, 1269],
  [1271, 1271],
  [1273, 1273],
  [1275, 1275],
  [1277, 1277],
  [1279, 1279],
  [1281, 1281],
  [1283, 1283],
  [1285, 1285],
  [1287, 1287],
  [1289, 1289],
  [1291, 1291],
  [1293, 1293],
  [1295, 1295],
  [1297, 1297],
  [1299, 1299],
  [1301, 1301],
  [1303, 1303],
  [1305, 1305],
  [1307, 1307],
  [1309, 1309],
  [1311, 1311],
  [1313, 1313],
  [1315, 1315],
  [1317, 1317],
  [1319, 1319],
  [1377, 1415],
  [7424, 7615],
  [7681, 7681],
  [7683, 7683],
  [7685, 7685],
  [7687, 7687],
  [7689, 7689],
  [7691, 7691],
  [7693, 7693],
  [7695, 7695],
  [7697, 7697],
  [7699, 7699],
  [7701, 7701],
  [7703, 7703],
  [7705, 7705],
  [7707, 7707],
  [7709, 7709],
  [7711, 7711],
  [7713, 7713],
  [7715, 7715],
  [7717, 7717],
  [7719, 7719],
  [7721, 7721],
  [7723, 7723],
  [7725, 7725],
  [7727, 7727],
  [7729, 7729],
  [7731, 7731],
  [7733, 7733],
  [7735, 7735],
  [7737, 7737],
  [7739, 7739],
  [7741, 7741],
  [7743, 7743],
  [7745, 7745],
  [7747, 7747],
  [7749, 7749],
  [7751, 7751],
  [7753, 7753],
  [7755, 7755],
  [7757, 7757],
  [7759, 7759],
  [7761, 7761],
  [7763, 7763],
  [7765, 7765],
  [7767, 7767],
  [7769, 7769],
  [7771, 7771],
  [7773, 7773],
  [7775, 7775],
  [7777, 7777],
  [7779, 7779],
  [7781, 7781],
  [7783, 7783],
  [7785, 7785],
  [7787, 7787],
  [7789, 7789],
  [7791, 7791],
  [7793, 7793],
  [7795, 7795],
  [7797, 7797],
  [7799, 7799],
  [7801, 7801],
  [7803, 7803],
  [7805, 7805],
  [7807, 7807],
  [7809, 7809],
  [7811, 7811],
  [7813, 7813],
  [7815, 7815],
  [7817, 7817],
  [7819, 7819],
  [7821, 7821],
  [7823, 7823],
  [7825, 7825],
  [7827, 7827],
  [7829, 7837],
  [7839, 7839],
  [7841, 7841],
  [7843, 7843],
  [7845, 7845],
  [7847, 7847],
  [7849, 7849],
  [7851, 7851],
  [7853, 7853],
  [7855, 7855],
  [7857, 7857],
  [7859, 7859],
  [7861, 7861],
  [7863, 7863],
  [7865, 7865],
  [7867, 7867],
  [7869, 7869],
  [7871, 7871],
  [7873, 7873],
  [7875, 7875],
  [7877, 7877],
  [7879, 7879],
  [7881, 7881],
  [7883, 7883],
  [7885, 7885],
  [7887, 7887],
  [7889, 7889],
  [7891, 7891],
  [7893, 7893],
  [7895, 7895],
  [7897, 7897],
  [7899, 7899],
  [7901, 7901],
  [7903, 7903],
  [7905, 7905],
  [7907, 7907],
  [7909, 7909],
  [7911, 7911],
  [7913, 7913],
  [7915, 7915],
  [7917, 7917],
  [7919, 7919],
  [7921, 7921],
  [7923, 7923],
  [7925, 7925],
  [7927, 7927],
  [7929, 7929],
  [7931, 7931],
  [7933, 7933],
  [7935, 7943],
  [7952, 7957],
  [7968, 7975],
  [7984, 7991],
  [8000, 8005],
  [8016, 8023],
  [8032, 8039],
  [8048, 8061],
  [8064, 8071],
  [8080, 8087],
  [8096, 8103],
  [8112, 8116],
  [8118, 8119],
  [8126, 8126],
  [8130, 8132],
  [8134, 8135],
  [8144, 8147],
  [8150, 8151],
  [8160, 8167],
  [8178, 8180],
  [8182, 8183],
  [8336, 8340],
  [8458, 8458],
  [8462, 8463],
  [8467, 8467],
  [8495, 8495],
  [8500, 8500],
  [8505, 8505],
  [8508, 8509],
  [8518, 8521],
  [8526, 8526],
  [8560, 8575],
  [8580, 8580],
  [9424, 9449],
  [11312, 11358],
  [11361, 11361],
  [11365, 11366],
  [11368, 11368],
  [11370, 11370],
  [11372, 11372],
  [11377, 11377],
  [11379, 11380],
  [11382, 11389],
  [11393, 11393],
  [11395, 11395],
  [11397, 11397],
  [11399, 11399],
  [11401, 11401],
  [11403, 11403],
  [11405, 11405],
  [11407, 11407],
  [11409, 11409],
  [11411, 11411],
  [11413, 11413],
  [11415, 11415],
  [11417, 11417],
  [11419, 11419],
  [11421, 11421],
  [11423, 11423],
  [11425, 11425],
  [11427, 11427],
  [11429, 11429],
  [11431, 11431],
  [11433, 11433],
  [11435, 11435],
  [11437, 11437],
  [11439, 11439],
  [11441, 11441],
  [11443, 11443],
  [11445, 11445],
  [11447, 11447],
  [11449, 11449],
  [11451, 11451],
  [11453, 11453],
  [11455, 11455],
  [11457, 11457],
  [11459, 11459],
  [11461, 11461],
  [11463, 11463],
  [11465, 11465],
  [11467, 11467],
  [11469, 11469],
  [11471, 11471],
  [11473, 11473],
  [11475, 11475],
  [11477, 11477],
  [11479, 11479],
  [11481, 11481],
  [11483, 11483],
  [11485, 11485],
  [11487, 11487],
  [11489, 11489],
  [11491, 11492],
  [11500, 11500],
  [11502, 11502],
  [11520, 11557],
  [42561, 42561],
  [42563, 42563],
  [42565, 42565],
  [42567, 42567],
  [42569, 42569],
  [42571, 42571],
  [42573, 42573],
  [42575, 42575],
  [42577, 42577],
  [42579, 42579],
  [42581, 42581],
  [42583, 42583],
  [42585, 42585],
  [42587, 42587],
  [42589, 42589],
  [42591, 42591],
  [42593, 42593],
  [42595, 42595],
  [42597, 42597],
  [42599, 42599],
  [42601, 42601],
  [42603, 42603],
  [42605, 42605],
  [42625, 42625],
  [42627, 42627],
  [42629, 42629],
  [42631, 42631],
  [42633, 42633],
  [42635, 42635],
  [42637, 42637],
  [42639, 42639],
  [42641, 42641],
  [42643, 42643],
  [42645, 42645],
  [42647, 42647],
  [42787, 42787],
  [42789, 42789],
  [42791, 42791],
  [42793, 42793],
  [42795, 42795],
  [42797, 42797],
  [42799, 42801],
  [42803, 42803],
  [42805, 42805],
  [42807, 42807],
  [42809, 42809],
  [42811, 42811],
  [42813, 42813],
  [42815, 42815],
  [42817, 42817],
  [42819, 42819],
  [42821, 42821],
  [42823, 42823],
  [42825, 42825],
  [42827, 42827],
  [42829, 42829],
  [42831, 42831],
  [42833, 42833],
  [42835, 42835],
  [42837, 42837],
  [42839, 42839],
  [42841, 42841],
  [42843, 42843],
  [42845, 42845],
  [42847, 42847],
  [42849, 42849],
  [42851, 42851],
  [42853, 42853],
  [42855, 42855],
  [42857, 42857],
  [42859, 42859],
  [42861, 42861],
  [42863, 42872],
  [42874, 42874],
  [42876, 42876],
  [42879, 42879],
  [42881, 42881],
  [42883, 42883],
  [42885, 42885],
  [42887, 42887],
  [42892, 42892],
  [42894, 42894],
  [42897, 42897],
  [42913, 42913],
  [42915, 42915],
  [42917, 42917],
  [42919, 42919],
  [42921, 42921],
  [43002, 43002],
  [64256, 64262],
  [64275, 64279],
  [65345, 65370],
  [66600, 66639],
  [119834, 119859],
  [119886, 119892],
  [119894, 119911],
  [119938, 119963],
  [119990, 119993],
  [119995, 119995],
  [119997, 120003],
  [120005, 120015],
  [120042, 120067],
  [120094, 120119],
  [120146, 120171],
  [120198, 120223],
  [120250, 120275],
  [120302, 120327],
  [120354, 120379],
  [120406, 120431],
  [120458, 120485],
  [120514, 120538],
  [120540, 120545],
  [120572, 120596],
  [120598, 120603],
  [120630, 120654],
  [120656, 120661],
  [120688, 120712],
  [120714, 120719],
  [120746, 120770],
  [120772, 120777],
  [120779, 120779],
];

// Base 10 digits (0 through 9)
export const DIGITS = [[48, 57]];

// Nonalphanumeric characters: ~!@#$%^&*_-+=`|\(){}[]:;"'<>,.?/
export const NON_ALPHA = [
  [0, 47],
  [58, 64],
  [91, 96],
  [123, 169],
  [171, 180],
  [182, 185],
  [187, 191],
  [215, 215],
  [247, 247],
  [706, 709],
  [722, 735],
  [741, 747],
  [749, 749],
  [751, 879],
  [885, 885],
  [888, 889],
  [894, 901],
  [903, 903],
  [907, 907],
  [909, 909],
  [930, 930],
  [1014, 1014],
  [1154, 1161],
  [1320, 1328],
  [1367, 1368],
  [1370, 1376],
  [1416, 1487],
  [1515, 1519],
  [1523, 1567],
  [1611, 1631],
  [1642, 1645],
  [1648, 1648],
  [1748, 1748],
  [1750, 1764],
  [1767, 1773],
  [1789, 1790],
  [1792, 1807],
  [1809, 1809],
  [1840, 1868],
  [1958, 1968],
  [1970, 1983],
  [2027, 2035],
  [2038, 2041],
  [2043, 2047],
  [2070, 2073],
  [2075, 2083],
  [2085, 2087],
  [2089, 2111],
  [2137, 2307],
  [2362, 2364],
  [2366, 2383],
  [2385, 2391],
  [2402, 2405],
  [2416, 2416],
  [2424, 2424],
  [2432, 2436],
  [2445, 2446],
  [2449, 2450],
  [2473, 2473],
  [2481, 2481],
  [2483, 2485],
  [2490, 2492],
  [2494, 2509],
  [2511, 2523],
  [2526, 2526],
  [2530, 2533],
  [2546, 2564],
  [2571, 2574],
  [2577, 2578],
  [2601, 2601],
  [2609, 2609],
  [2612, 2612],
  [2615, 2615],
  [2618, 2648],
  [2653, 2653],
  [2655, 2661],
  [2672, 2673],
  [2677, 2692],
  [2702, 2702],
  [2706, 2706],
  [2729, 2729],
  [2737, 2737],
  [2740, 2740],
  [2746, 2748],
  [2750, 2767],
  [2769, 2783],
  [2786, 2789],
  [2800, 2820],
  [2829, 2830],
  [2833, 2834],
  [2857, 2857],
  [2865, 2865],
  [2868, 2868],
  [2874, 2876],
  [2878, 2907],
  [2910, 2910],
  [2914, 2917],
  [2928, 2928],
  [2930, 2946],
  [2948, 2948],
  [2955, 2957],
  [2961, 2961],
  [2966, 2968],
  [2971, 2971],
  [2973, 2973],
  [2976, 2978],
  [2981, 2983],
  [2987, 2989],
  [3002, 3023],
  [3025, 3045],
  [3056, 3076],
  [3085, 3085],
  [3089, 3089],
  [3113, 3113],
  [3124, 3124],
  [3130, 3132],
  [3134, 3159],
  [3162, 3167],
  [3170, 3173],
  [3184, 3204],
  [3213, 3213],
  [3217, 3217],
  [3241, 3241],
  [3252, 3252],
  [3258, 3260],
  [3262, 3293],
  [3295, 3295],
  [3298, 3301],
  [3312, 3312],
  [3315, 3332],
  [3341, 3341],
  [3345, 3345],
  [3387, 3388],
  [3390, 3405],
  [3407, 3423],
  [3426, 3429],
  [3440, 3449],
  [3456, 3460],
  [3479, 3481],
  [3506, 3506],
  [3516, 3516],
  [3518, 3519],
  [3527, 3584],
  [3633, 3633],
  [3636, 3647],
  [3655, 3663],
  [3674, 3712],
  [3715, 3715],
  [3717, 3718],
  [3721, 3721],
  [3723, 3724],
  [3726, 3731],
  [3736, 3736],
  [3744, 3744],
  [3748, 3748],
  [3750, 3750],
  [3752, 3753],
  [3756, 3756],
  [3761, 3761],
  [3764, 3772],
  [3774, 3775],
  [3781, 3781],
  [3783, 3791],
  [3802, 3803],
  [3806, 3839],
  [3841, 3871],
  [3882, 3903],
  [3912, 3912],
  [3949, 3975],
  [3981, 4095],
  [4139, 4158],
  [4170, 4175],
  [4182, 4185],
  [4190, 4192],
  [4194, 4196],
  [4199, 4205],
  [4209, 4212],
  [4226, 4237],
  [4239, 4239],
  [4250, 4255],
  [4294, 4303],
  [4347, 4347],
  [4349, 4351],
  [4681, 4681],
  [4686, 4687],
  [4695, 4695],
  [4697, 4697],
  [4702, 4703],
  [4745, 4745],
  [4750, 4751],
  [4785, 4785],
  [4790, 4791],
  [4799, 4799],
  [4801, 4801],
  [4806, 4807],
  [4823, 4823],
  [4881, 4881],
  [4886, 4887],
  [4955, 4991],
  [5008, 5023],
  [5109, 5120],
  [5741, 5742],
  [5760, 5760],
  [5787, 5791],
  [5867, 5887],
  [5901, 5901],
  [5906, 5919],
  [5938, 5951],
  [5970, 5983],
  [5997, 5997],
  [6001, 6015],
  [6068, 6102],
  [6104, 6107],
  [6109, 6111],
  [6122, 6159],
  [6170, 6175],
  [6264, 6271],
  [6313, 6313],
  [6315, 6319],
  [6390, 6399],
  [6429, 6469],
  [6510, 6511],
  [6517, 6527],
  [6572, 6592],
  [6600, 6607],
  [6618, 6655],
  [6679, 6687],
  [6741, 6783],
  [6794, 6799],
  [6810, 6822],
  [6824, 6916],
  [6964, 6980],
  [6988, 6991],
  [7002, 7042],
  [7073, 7085],
  [7098, 7103],
  [7142, 7167],
  [7204, 7231],
  [7242, 7244],
  [7294, 7400],
  [7405, 7405],
  [7410, 7423],
  [7616, 7679],
  [7958, 7959],
  [7966, 7967],
  [8006, 8007],
  [8014, 8015],
  [8024, 8024],
  [8026, 8026],
  [8028, 8028],
  [8030, 8030],
  [8062, 8063],
  [8117, 8117],
  [8125, 8125],
  [8127, 8129],
  [8133, 8133],
  [8141, 8143],
  [8148, 8149],
  [8156, 8159],
  [8173, 8177],
  [8181, 8181],
  [8189, 8304],
  [8306, 8318],
  [8320, 8335],
  [8349, 8449],
  [8451, 8454],
  [8456, 8457],
  [8468, 8468],
  [8470, 8472],
  [8478, 8483],
  [8485, 8485],
  [8487, 8487],
  [8489, 8489],
  [8494, 8494],
  [8506, 8507],
  [8512, 8516],
  [8522, 8525],
  [8527, 8578],
  [8581, 11263],
  [11311, 11311],
  [11359, 11359],
  [11493, 11498],
  [11503, 11519],
  [11558, 11567],
  [11622, 11630],
  [11632, 11647],
  [11671, 11679],
  [11687, 11687],
  [11695, 11695],
  [11703, 11703],
  [11711, 11711],
  [11719, 11719],
  [11727, 11727],
  [11735, 11735],
  [11743, 11822],
  [11824, 12292],
  [12295, 12336],
  [12342, 12346],
  [12349, 12352],
  [12439, 12444],
  [12448, 12448],
  [12539, 12539],
  [12544, 12548],
  [12590, 12592],
  [12687, 12703],
  [12731, 12783],
  [12800, 13311],
  [19894, 19967],
  [40908, 40959],
  [42125, 42191],
  [42238, 42239],
  [42509, 42511],
  [42540, 42559],
  [42607, 42622],
  [42648, 42655],
  [42726, 42774],
  [42784, 42785],
  [42889, 42890],
  [42895, 42895],
  [42898, 42911],
  [42922, 43001],
  [43010, 43010],
  [43014, 43014],
  [43019, 43019],
  [43043, 43071],
  [43124, 43137],
  [43188, 43215],
  [43226, 43249],
  [43256, 43258],
  [43260, 43263],
  [43302, 43311],
  [43335, 43359],
  [43389, 43395],
  [43443, 43470],
  [43482, 43519],
  [43561, 43583],
  [43587, 43587],
  [43596, 43599],
  [43610, 43615],
  [43639, 43641],
  [43643, 43647],
  [43696, 43696],
  [43698, 43700],
  [43703, 43704],
  [43710, 43711],
  [43713, 43713],
  [43715, 43738],
  [43742, 43776],
  [43783, 43784],
  [43791, 43792],
  [43799, 43807],
  [43815, 43815],
  [43823, 43967],
  [44003, 44015],
  [44026, 44031],
  [55204, 55215],
  [55239, 55242],
  [55292, 63743],
  [64046, 64047],
  [64110, 64111],
  [64218, 64255],
  [64263, 64274],
  [64280, 64284],
  [64286, 64286],
  [64297, 64297],
  [64311, 64311],
  [64317, 64317],
  [64319, 64319],
  [64322, 64322],
  [64325, 64325],
  [64434, 64466],
  [64830, 64847],
  [64912, 64913],
  [64968, 65007],
  [65020, 65135],
  [65141, 65141],
  [65277, 65295],
  [65306, 65312],
  [65339, 65344],
  [65371, 65381],
  [65471, 65473],
  [65480, 65481],
  [65488, 65489],
  [65496, 65497],
  [65501, 65535],
  [65548, 65548],
  [65575, 65575],
  [65595, 65595],
  [65598, 65598],
  [65614, 65615],
  [65630, 65663],
  [65787, 66175],
  [66205, 66207],
  [66257, 66303],
  [66335, 66351],
  [66369, 66369],
  [66378, 66431],
  [66462, 66463],
  [66500, 66503],
  [66512, 66559],
  [66718, 66719],
  [66730, 67583],
  [67590, 67591],
  [67593, 67593],
  [67638, 67638],
  [67641, 67643],
  [67645, 67646],
  [67670, 67839],
  [67862, 67871],
  [67898, 68095],
  [68097, 68111],
  [68116, 68116],
  [68120, 68120],
  [68148, 68191],
  [68221, 68351],
  [68406, 68415],
  [68438, 68447],
  [68467, 68607],
  [68681, 69634],
  [69688, 69733],
  [69744, 69762],
  [69808, 73727],
  [74607, 77823],
  [78895, 92159],
  [92729, 110591],
  [110594, 119807],
  [119893, 119893],
  [119965, 119965],
  [119968, 119969],
  [119971, 119972],
  [119975, 119976],
  [119981, 119981],
  [119994, 119994],
  [119996, 119996],
  [120004, 120004],
  [120070, 120070],
  [120075, 120076],
  [120085, 120085],
  [120093, 120093],
  [120122, 120122],
  [120127, 120127],
  [120133, 120133],
  [120135, 120137],
  [120145, 120145],
  [120486, 120487],
  [120513, 120513],
  [120539, 120539],
  [120571, 120571],
  [120597, 120597],
  [120629, 120629],
  [120655, 120655],
  [120687, 120687],
  [120713, 120713],
  [120745, 120745],
  [120771, 120771],
  [120780, 120781],
  [120832, 131071],
  [173783, 173823],
  [177973, 177983],
  [178206, 194559],
  [195102, 1114111],
];

// Alphabetic characters that are not uppercase or lowercase
export const ALPHA_OTHERS = [
  [443, 443],
  [448, 451],
  [453, 453],
  [456, 456],
  [459, 459],
  [498, 498],
  [660, 660],
  [697, 703],
  [710, 721],
  [748, 748],
  [750, 750],
  [884, 884],
  [1369, 1369],
  [1456, 1469],
  [1471, 1471],
  [1473, 1474],
  [1476, 1477],
  [1479, 1479],
  [1488, 1514],
  [1520, 1522],
  [1552, 1562],
  [1568, 1623],
  [1625, 1631],
  [1646, 1747],
  [1749, 1756],
  [1761, 1768],
  [1773, 1775],
  [1786, 1788],
  [1791, 1791],
  [1808, 1855],
  [1869, 1969],
  [1994, 2026],
  [2036, 2037],
  [2042, 2042],
  [2048, 2071],
  [2074, 2092],
  [2112, 2136],
  [2304, 2363],
  [2365, 2380],
  [2382, 2384],
  [2389, 2403],
  [2417, 2423],
  [2425, 2431],
  [2433, 2435],
  [2437, 2444],
  [2447, 2448],
  [2451, 2472],
  [2474, 2480],
  [2482, 2482],
  [2486, 2489],
  [2493, 2500],
  [2503, 2504],
  [2507, 2508],
  [2510, 2510],
  [2519, 2519],
  [2524, 2525],
  [2527, 2531],
  [2544, 2545],
  [2561, 2563],
  [2565, 2570],
  [2575, 2576],
  [2579, 2600],
  [2602, 2608],
  [2610, 2611],
  [2613, 2614],
  [2616, 2617],
  [2622, 2626],
  [2631, 2632],
  [2635, 2636],
  [2641, 2641],
  [2649, 2652],
  [2654, 2654],
  [2672, 2677],
  [2689, 2691],
  [2693, 2701],
  [2703, 2705],
  [2707, 2728],
  [2730, 2736],
  [2738, 2739],
  [2741, 2745],
  [2749, 2757],
  [2759, 2761],
  [2763, 2764],
  [2768, 2768],
  [2784, 2787],
  [2817, 2819],
  [2821, 2828],
  [2831, 2832],
  [2835, 2856],
  [2858, 2864],
  [2866, 2867],
  [2869, 2873],
  [2877, 2884],
  [2887, 2888],
  [2891, 2892],
  [2902, 2903],
  [2908, 2909],
  [2911, 2915],
  [2929, 2929],
  [2946, 2947],
  [2949, 2954],
  [2958, 2960],
  [2962, 2965],
  [2969, 2970],
  [2972, 2972],
  [2974, 2975],
  [2979, 2980],
  [2984, 2986],
  [2990, 3001],
  [3006, 3010],
  [3014, 3016],
  [3018, 3020],
  [3024, 3024],
  [3031, 3031],
  [3073, 3075],
  [3077, 3084],
  [3086, 3088],
  [3090, 3112],
  [3114, 3123],
  [3125, 3129],
  [3133, 3140],
  [3142, 3144],
  [3146, 3148],
  [3157, 3158],
  [3160, 3161],
  [3168, 3171],
  [3202, 3203],
  [3205, 3212],
  [3214, 3216],
  [3218, 3240],
  [3242, 3251],
  [3253, 3257],
  [3261, 3268],
  [3270, 3272],
  [3274, 3276],
  [3285, 3286],
  [3294, 3294],
  [3296, 3299],
  [3313, 3314],
  [3330, 3331],
  [3333, 3340],
  [3342, 3344],
  [3346, 3386],
  [3389, 3396],
  [3398, 3400],
  [3402, 3404],
  [3406, 3406],
  [3415, 3415],
  [3424, 3427],
  [3450, 3455],
  [3458, 3459],
  [3461, 3478],
  [3482, 3505],
  [3507, 3515],
  [3517, 3517],
  [3520, 3526],
  [3535, 3540],
  [3542, 3542],
  [3544, 3551],
  [3570, 3571],
  [3585, 3642],
  [3648, 3654],
  [3661, 3661],
  [3713, 3714],
  [3716, 3716],
  [3719, 3720],
  [3722, 3722],
  [3725, 3725],
  [3732, 3735],
  [3737, 3743],
  [3745, 3747],
  [3749, 3749],
  [3751, 3751],
  [3754, 3755],
  [3757, 3769],
  [3771, 3773],
  [3776, 3780],
  [3782, 3782],
  [3789, 3789],
  [3804, 3805],
  [3840, 3840],
  [3904, 3911],
  [3913, 3948],
  [3953, 3969],
  [3976, 3991],
  [3993, 4028],
  [4096, 4150],
  [4152, 4152],
  [4155, 4159],
  [4176, 4194],
  [4197, 4200],
  [4206, 4230],
  [4238, 4238],
  [4252, 4253],
  [4304, 4346],
  [4348, 4348],
  [4352, 4680],
  [4682, 4685],
  [4688, 4694],
  [4696, 4696],
  [4698, 4701],
  [4704, 4744],
  [4746, 4749],
  [4752, 4784],
  [4786, 4789],
  [4792, 4798],
  [4800, 4800],
  [4802, 4805],
  [4808, 4822],
  [4824, 4880],
  [4882, 4885],
  [4888, 4954],
  [4959, 4959],
  [4992, 5007],
  [5024, 5108],
  [5121, 5740],
  [5743, 5759],
  [5761, 5786],
  [5792, 5866],
  [5870, 5872],
  [5888, 5900],
  [5902, 5907],
  [5920, 5939],
  [5952, 5971],
  [5984, 5996],
  [5998, 6000],
  [6002, 6003],
  [6016, 6067],
  [6070, 6088],
  [6103, 6103],
  [6108, 6108],
  [6176, 6263],
  [6272, 6314],
  [6320, 6389],
  [6400, 6428],
  [6432, 6443],
  [6448, 6456],
  [6480, 6509],
  [6512, 6516],
  [6528, 6571],
  [6576, 6601],
  [6656, 6683],
  [6688, 6750],
  [6753, 6772],
  [6823, 6823],
  [6912, 6963],
  [6965, 6979],
  [6981, 6987],
  [7040, 7081],
  [7086, 7087],
  [7104, 7141],
  [7143, 7153],
  [7168, 7221],
  [7245, 7247],
  [7258, 7293],
  [7401, 7404],
  [7406, 7410],
  [8072, 8079],
  [8088, 8095],
  [8104, 8111],
  [8124, 8124],
  [8140, 8140],
  [8188, 8188],
  [8305, 8305],
  [8319, 8319],
  [8341, 8348],
  [8501, 8504],
  [8576, 8578],
  [8581, 8584],
  [11568, 11621],
  [11631, 11631],
  [11648, 11670],
  [11680, 11686],
  [11688, 11694],
  [11696, 11702],
  [11704, 11710],
  [11712, 11718],
  [11720, 11726],
  [11728, 11734],
  [11736, 11742],
  [11744, 11775],
  [11823, 11823],
  [12293, 12295],
  [12321, 12329],
  [12337, 12341],
  [12344, 12348],
  [12353, 12438],
  [12445, 12447],
  [12449, 12538],
  [12540, 12543],
  [12549, 12589],
  [12593, 12686],
  [12704, 12730],
  [12784, 12799],
  [13312, 19893],
  [19968, 40907],
  [40960, 42124],
  [42192, 42237],
  [42240, 42508],
  [42512, 42527],
  [42538, 42539],
  [42606, 42606],
  [42623, 42623],
  [42656, 42735],
  [42775, 42783],
  [42888, 42888],
  [43003, 43009],
  [43011, 43013],
  [43015, 43018],
  [43020, 43047],
  [43072, 43123],
  [43136, 43203],
  [43250, 43255],
  [43259, 43259],
  [43274, 43306],
  [43312, 43346],
  [43360, 43388],
  [43392, 43442],
  [43444, 43455],
  [43471, 43471],
  [43520, 43574],
  [43584, 43597],
  [43616, 43638],
  [43642, 43642],
  [43648, 43710],
  [43712, 43712],
  [43714, 43714],
  [43739, 43741],
  [43777, 43782],
  [43785, 43790],
  [43793, 43798],
  [43808, 43814],
  [43816, 43822],
  [43968, 44010],
  [44032, 55203],
  [55216, 55238],
  [55243, 55291],
  [63744, 64045],
  [64048, 64109],
  [64112, 64217],
  [64285, 64296],
  [64298, 64310],
  [64312, 64316],
  [64318, 64318],
  [64320, 64321],
  [64323, 64324],
  [64326, 64433],
  [64467, 64829],
  [64848, 64911],
  [64914, 64967],
  [65008, 65019],
  [65136, 65140],
  [65142, 65276],
  [65382, 65470],
  [65474, 65479],
  [65482, 65487],
  [65490, 65495],
  [65498, 65500],
  [65536, 65547],
  [65549, 65574],
  [65576, 65594],
  [65596, 65597],
  [65599, 65613],
  [65616, 65629],
  [65664, 65786],
  [65856, 65908],
  [66176, 66204],
  [66208, 66256],
  [66304, 66334],
  [66352, 66378],
  [66432, 66461],
  [66464, 66499],
  [66504, 66511],
  [66513, 66517],
  [66640, 66717],
  [67584, 67589],
  [67592, 67592],
  [67594, 67637],
  [67639, 67640],
  [67644, 67644],
  [67647, 67669],
  [67840, 67861],
  [67872, 67897],
  [68096, 68099],
  [68101, 68102],
  [68108, 68115],
  [68117, 68119],
  [68121, 68147],
  [68192, 68220],
  [68352, 68405],
  [68416, 68437],
  [68448, 68466],
  [68608, 68680],
  [69632, 69701],
  [69762, 69816],
  [73728, 74606],
  [74752, 74850],
  [77824, 78894],
  [92160, 92728],
  [110592, 110593],
  [131072, 173782],
  [173824, 177972],
  [177984, 178205],
  [194560, 195101],
];

export const FEATURES = [UPPERCASE, LOWERCASE, DIGITS, NON_ALPHA, ALPHA_OTHERS];

export default {
  UPPERCASE,
  LOWERCASE,
  DIGITS,
  NON_ALPHA,
  ALPHA_OTHERS,
  FEATURES,
};
