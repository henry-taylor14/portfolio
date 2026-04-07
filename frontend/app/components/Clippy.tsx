'use client'

import {useState, useRef, useEffect} from 'react'
import {usePathname} from 'next/navigation'
import {AnimatePresence, motion} from 'framer-motion'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export type ClippyVariant = 'home' | 'blog' | 'post' | 'contact' | 'timeline' | 'about'

function getVariant(pathname: string): ClippyVariant {
  if (pathname === '/') return 'home'
  if (pathname === '/posts') return 'blog'
  if (pathname.startsWith('/posts/')) return 'post'
  if (pathname === '/contact') return 'contact'
  if (pathname === '/timeline') return 'timeline'
  return 'about'
}

const EASE = [0.33, 0, 1, 1] as [number, number, number, number]

const ClippySVG = ({
  variant: _variant,
  collapsing = false,
}: {
  variant: ClippyVariant
  collapsing?: boolean
}) => (
  <svg
    viewBox="0 0 2048 2150"
    width="100%"
    height="100%"
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="974" cy="1980" rx="550" ry="35" fill="rgba(0,0,0,0.18)" />
    {/* Body */}
    <motion.g
      animate={
        collapsing
          ? {y: 800, x: -50, rotate: -90, rotateY: 85}
          : {x: 0, y: 0, rotate: 0, rotateY: 0, opacity: 1}
      }
      transition={{duration: 0.7, ease: EASE}}
    >
      <path
        transform="translate(0,0)"
        fill="rgb(100,110,125)"
        d="M 1075.7 137.23 C 1077.19 139.271 1072.11 147.011 1070.42 150.228 C 1057.59 174.742 1048.13 199.748 1045.61 227.472 C 1090.52 174.829 1126.79 165.911 1191.29 158.214 C 1172 168.951 1138.28 201.5 1124.92 219.376 C 1203.83 178.048 1275.32 182.256 1352.5 224.544 C 1312.92 228.951 1273.41 237.673 1238.22 256.584 C 1316.3 236.05 1366.24 255.877 1429.44 300.267 C 1396.69 298.925 1378.88 297.228 1346.6 304.498 C 1359.24 308.054 1371.56 312.702 1383.39 318.389 C 1437.69 344.199 1473.5 388.095 1493.17 444.092 C 1466.55 428.691 1438.37 416.171 1409.11 406.743 C 1450.34 435.941 1476.45 461.612 1493.26 511.382 C 1497.4 523.637 1499.74 536.772 1503.25 549.332 C 1477.59 526.303 1463.92 515.358 1432.2 502.177 C 1438.09 515.831 1446.66 528.161 1457.42 538.429 C 1492.24 572.234 1539.69 578.723 1586.37 577.981 C 1547.29 610.722 1530.05 626.077 1477.63 624.905 C 1515.3 669.063 1526.86 695.784 1536.31 753.345 C 1524.55 745.049 1512.39 729.735 1498.33 719.115 C 1514.94 756.059 1512.98 769.135 1515.96 806.566 C 1492.37 781.689 1484.47 766.509 1453.6 747.052 C 1471 793.366 1499.22 819.403 1535.45 851.21 C 1504.36 848.108 1493.08 847.017 1463.69 835.46 C 1478.92 873.962 1483.75 898.606 1478.77 940.992 C 1477.29 953.626 1474.53 966.506 1473.41 979.109 C 1470.47 972.786 1467.02 962.518 1464.26 955.66 C 1454 930.245 1445.47 910.97 1428.8 888.911 C 1433.35 953.279 1418.32 994.927 1362.67 1030.9 C 1364.93 1010.36 1365.17 987.271 1357.12 967.308 C 1356.18 964.956 1355.83 965.069 1354.29 964.616 C 1344.32 1010.2 1320.4 1032.33 1283.53 1058.11 C 1283.09 1053.3 1285.51 1040.95 1286.1 1035.44 C 1288.33 1014.38 1284.4 997.719 1275.99 978.717 C 1247.21 992.848 1233.96 996.6 1202.03 999.971 C 1184.03 1095.55 1187.18 1198.54 1203.28 1294.02 C 1219.63 1391 1260.67 1521.5 1167.01 1592.96 C 1134.81 1617.46 1094.21 1628.21 1054.11 1622.84 C 1010.48 1616.72 976.104 1592.19 950.151 1557.35 C 885.07 1469.97 859.188 1289.98 851.376 1181.86 C 849.727 1159.03 846.15 1120.22 849.724 1099.18 C 851.504 1088.7 855.194 1081.13 864.152 1075.09 C 872.23 1069.64 882.003 1067.93 891.512 1069.88 C 903.247 1072.3 913.689 1080.84 916.986 1092.59 C 920.08 1103.62 918.964 1116.23 919.465 1127.61 C 920.448 1147.38 921.628 1167.14 923.004 1186.89 C 930.794 1287.38 950.995 1407.98 1000.2 1496.74 C 1043.2 1574.3 1146.68 1555.12 1150.11 1465.14 C 1151.98 1416.08 1137.63 1362.92 1129.42 1314.03 C 1111.67 1208.28 1106.2 1091.34 1126.59 985.404 L 1125.31 984.799 C 1086.81 966.499 1054.05 937.021 1039.95 896.161 C 1014.6 822.661 1057.25 754.649 1127.14 730.368 C 1122.59 728.962 1118.23 726.993 1114.17 724.507 C 1094.47 712.696 1083.4 689.235 1097.19 667.989 C 1112.21 644.871 1134.43 666.999 1151.52 670.692 C 1163.49 673.28 1186.21 668.343 1198.82 665.705 C 1203.87 605.219 1199.66 553.071 1160.54 504.761 C 1110.14 509.775 1068.44 530.605 1016.27 516.729 C 993.408 510.647 972.487 497.894 951.773 492.263 L 950.417 491.901 C 924.938 510.64 910.103 533.279 896.454 561.189 C 922.183 569.944 950.242 583.744 963.363 609.181 C 970.954 623.898 970.643 650.017 952.105 657.199 C 927.356 666.787 916.902 646.998 900.283 633.61 C 893.018 627.757 884.578 624.128 875.734 620.523 L 866.454 665.217 C 967.383 685.79 1025.57 803.077 952.779 886.279 C 926.849 920.582 878.858 934.648 838.022 937.851 C 836.869 979.121 835.642 1020.18 836.304 1061.49 C 839.479 1259.52 871.745 1476.94 944.884 1661.18 C 962.884 1706.53 985.734 1759.69 1021.41 1793.94 C 1049.32 1820.75 1085.96 1836.89 1124.99 1836 C 1165.7 1835.07 1207.04 1817.15 1235.11 1787.57 C 1261.41 1759.88 1274.23 1725.32 1277.36 1687.63 C 1283.15 1617.65 1258.99 1528.05 1243.41 1459.14 C 1225.96 1381.95 1208.75 1303.45 1206.56 1224.06 C 1205.65 1191.31 1208.48 1089.76 1230.71 1067.41 C 1237.58 1060.49 1247.16 1057.4 1256.79 1057.47 C 1267.28 1057.53 1277.35 1061.63 1284.5 1069.39 C 1289.68 1075.02 1293.01 1082.72 1293.49 1090.37 C 1294.43 1105.55 1288.95 1121.59 1286.92 1136.69 C 1283.77 1160.33 1282.14 1184.15 1282.03 1208 C 1281.48 1314.29 1316.35 1426.5 1337.01 1530.59 C 1359.19 1642.4 1375.32 1767.18 1279.63 1852.62 C 1232.63 1894.26 1171.02 1915.52 1108.35 1911.73 C 966.299 1903.5 907.085 1782.41 865.442 1665.35 C 783.214 1434.2 745.926 1167.18 762.034 922.096 L 751.815 916.696 C 727.469 936.289 710.871 960.625 707.474 991.839 C 706.64 999.506 706.257 1007.32 704.975 1014.87 L 704.752 1016.13 C 671.416 985.834 656.521 954.36 653.65 910.542 C 638.146 926.757 635.511 956.024 633.687 977.189 C 587.273 929.258 576.235 891.343 594.793 825.995 C 571.066 847.67 551.927 878.099 534.968 905.464 C 534.665 850.306 537.351 816.331 569.117 769.327 C 541.99 774.69 524.683 772.869 497.711 770.912 C 503.281 766.697 516.346 758.724 522.911 754.523 C 554.344 734.406 574.133 718.025 592.531 685.52 C 561.803 696.933 549.894 710.813 524.81 730.295 C 527.862 708.306 529.596 698.33 537.508 677.248 C 518.693 695.298 494.143 726.203 477.312 746.667 C 492.771 665.372 511.994 621.549 580.085 569.528 L 575.869 568.664 C 532.23 559.546 509.881 540.485 485.525 503.184 C 545.532 515.13 597.203 516.644 639.061 465.536 C 609.565 470.381 589.986 481.884 564.606 496.521 C 567.778 487.939 571.235 478.778 575.052 470.485 C 595.377 426.956 632.285 393.376 677.536 377.241 C 646.072 378.622 618.788 387.622 589.842 399.104 C 608.124 344.586 649.943 324.356 702.304 312.684 C 675.069 307.188 650.763 306.178 623.215 310.821 C 674.313 254.267 739.911 221.102 817.211 234.981 C 802.295 215.337 767.352 189.963 744.79 180.94 C 745.598 180.885 746.406 180.837 747.215 180.796 C 802.944 178.054 842.379 183.626 885.043 222.119 C 864.482 187.615 835.682 164.265 803.627 140.538 C 818.915 144.112 836.594 145.431 851.984 149.537 C 907.729 164.411 947.594 187.124 977.802 236.386 C 996.089 181.929 1020.19 154.26 1075.7 137.23 z"
      />
      <path
        transform="translate(0,0)"
        fill="rgb(200,208,218)"
        d="M 984.651 282.971 C 987.319 235.787 1006.37 189.572 1048.02 164.391 C 1030.26 202.346 1028.81 228.472 1033.54 268.783 C 1062.45 227.158 1088.77 197.114 1138.76 181.508 C 1109.64 210.168 1101.96 225.578 1086.64 264.378 C 1137.26 224.303 1187.72 198.791 1254.74 206.579 C 1271.2 208.439 1287.36 212.365 1302.83 218.262 C 1251.43 226.585 1211.1 248.957 1185.1 294.827 C 1251.89 261.247 1308.02 249.461 1377.69 284.722 C 1349.67 287.147 1324.36 293.939 1299.87 308.301 C 1369.54 324.01 1426.59 345.22 1462.83 412.101 C 1421.28 392.788 1394.73 386.156 1348.4 390.035 C 1402.74 418.541 1454 446.136 1476.77 507.984 C 1453.25 493.551 1436.76 486.574 1409.26 482.008 C 1434.87 553.61 1471.52 583.285 1547.79 591.064 C 1504.96 617.549 1476.03 615.274 1430.28 597.2 C 1468.44 634.193 1493.89 660.771 1512.78 711.675 C 1485.87 688.758 1474.62 682.852 1440.63 670.963 C 1473.76 705.151 1485.68 714.714 1498.12 763.601 C 1478.84 744.257 1461.87 733.255 1436.51 722.701 C 1439.4 766.127 1459.96 798.78 1489.68 829.367 C 1461.63 819.319 1450.43 811.466 1426.89 793.488 C 1451.24 840.558 1465.59 866.813 1466.35 920.533 C 1444.22 881.334 1436.01 873.787 1404.11 842.694 C 1417.24 902.264 1428.17 952.461 1379.12 999.554 C 1378.13 990.822 1377.22 981.823 1374.99 973.316 C 1368.11 952.302 1360.06 941.776 1343.13 928.426 C 1340.99 976.379 1333.77 992.923 1301.84 1026.62 C 1300.77 1003.01 1298.86 992.451 1288.07 971.154 C 1303.99 958.689 1314.95 948.468 1325.7 930.94 C 1342.78 902.66 1347.99 868.774 1340.19 836.669 C 1329.47 792.086 1302.04 765.127 1264.51 741.931 C 1266.86 732.385 1268.46 719.022 1269.3 709.304 C 1295.97 706.15 1306.65 708.314 1331.91 714.692 C 1342.51 710.813 1344.82 706.418 1342.67 695.436 C 1341.1 694.446 1334.8 688.78 1331.1 686.338 C 1312.58 674.099 1295.75 666.768 1274.07 662.256 C 1276.44 634.06 1275.46 597.049 1267.23 570.278 C 1260.87 548.834 1248.45 529.684 1231.47 515.125 C 1163.35 456.661 1091.06 524.752 1016.03 501.211 C 1005.13 497.791 992.982 493.327 982.89 487.952 L 982.053 487.497 C 973.109 483.876 964.133 480.338 955.124 476.883 C 941.502 473.303 929.47 470.295 915.189 470.984 C 862.194 473.543 828.036 512.308 814.35 560.741 C 800.603 565.279 788.742 569.646 776.254 577.267 C 773.897 578.706 766.277 583.67 764.089 584.49 C 752.941 592.343 744.693 597.981 736.365 609.086 C 731.923 627.483 745.433 628.099 758.928 623.607 C 772.378 619.13 785.559 614.744 799.76 613.431 C 795.695 630.101 792.753 647.411 789.605 664.315 C 748.007 674.802 714.187 693.703 691.596 731.561 C 675.648 758.287 673.467 778.023 674.633 807.997 C 680.967 849.325 698.339 879.274 732.42 904.488 C 734.504 906.029 736.641 907.496 738.829 908.885 C 716.277 929.344 699.548 951.133 693.948 981.618 C 667.603 947.226 666.337 921.233 671.401 879.663 C 648.996 891.026 634.508 906.437 626.429 930.736 C 625.068 934.799 623.913 938.927 622.969 943.106 C 584.343 885.308 603.462 844.242 626.944 785.359 C 595.206 804.697 573.205 823.286 551.045 853.345 C 553.121 842.553 555.561 829.491 559.473 819.376 C 570.114 791.869 593.395 757.289 612.864 734.679 C 588.918 746.406 572.841 754.534 545.999 757.684 C 580.718 733.079 605.678 704.923 616.526 663.198 C 587.646 669.852 572.859 675.12 548.221 691.922 C 559.217 659.872 571.212 653.441 594.025 630.316 C 554.067 640.485 533.745 657.943 506.444 688.509 C 532.716 621.63 574.629 587.036 634.391 550.663 C 589.484 561.244 553.615 556.146 519.86 523.48 C 529.82 524.07 539.855 524.873 549.832 524.637 C 601.814 523.409 643.76 496.175 665.573 449.016 C 639.746 449.787 619.932 452.535 595.615 462.317 C 629.932 406.863 679.701 388.398 740.117 371.913 C 690.938 361.414 670.972 358.949 621.379 372.088 C 655.063 330.64 702.034 326.293 752.362 321.097 L 755.589 320.766 C 721.646 302.982 702.163 294.705 663.588 292.985 C 718.025 248.851 777.161 233.676 844.281 257.659 C 834.241 231.017 823.578 215.227 801.213 197.424 C 845.646 205.616 868.652 220.394 896.247 258.207 C 902.581 266.886 908.375 277.575 914.597 286.137 C 906.57 227.642 900.572 210.196 860.858 167.532 C 930.893 190.009 954.845 218.464 984.651 282.971 z"
      />
    </motion.g>
    {/* Left eye white */}
    <motion.g
      animate={collapsing ? {y: 900, x: -150, rotate: -35} : {x: 0, y: 0, rotate: 0, opacity: 1}}
      transition={{duration: 0.6, ease: EASE, delay: 0.05}}
    >
      <path
        transform="translate(0,0)"
        fill="rgb(200,208,218)"
        d="M 746.958 776.165 C 775.285 775.059 876.554 783.349 903.051 791.745 C 927.432 796.411 946.64 801.579 970.492 808.27 C 968.176 838.921 953.762 867.391 930.43 887.402 C 848.47 959.046 701.659 915.556 689.582 802.238 C 688.724 794.179 689.635 785.233 690.272 777.115 C 709.16 776.455 728.059 776.138 746.958 776.165 z"
      />
    </motion.g>
    {/* Left eye pupil */}
    <motion.g
      animate={collapsing ? {y: 850, x: -200, rotate: -50} : {x: 0, y: 0, rotate: 0, opacity: 1}}
      transition={{duration: 0.55, ease: EASE, delay: 0.08}}
    >
      <path
        transform="translate(0,0)"
        fill="rgb(44,86,162)"
        d="M 746.958 776.165 C 775.285 775.059 876.554 783.349 903.051 791.745 C 903.529 811.005 893.863 830.611 879.598 843.268 C 864.758 856.237 845.371 862.774 825.708 861.439 C 805.972 860.025 787.663 850.633 775 835.429 C 760.443 818.119 756.205 798.968 758.229 776.952 C 754.468 776.744 750.711 776.482 746.958 776.165 z"
      />
    </motion.g>
    {/* Right eye white */}
    <motion.g
      animate={collapsing ? {y: 950, x: 120, rotate: 30} : {x: 0, y: 0, rotate: 0, opacity: 1}}
      transition={{duration: 0.65, ease: EASE, delay: 0.03}}
    >
      <path
        transform="translate(0,0)"
        fill="rgb(200,208,218)"
        d="M 1050.49 828.643 C 1071.03 827.833 1096.93 830.458 1117.26 832.297 C 1136.32 835.116 1155.29 836.812 1174.53 839.808 C 1204.32 844.573 1233.82 851.046 1262.87 859.194 C 1284.28 865.115 1306.52 872.645 1327.53 879.877 L 1327.42 880.86 C 1324.02 910.023 1307.17 936.68 1283.41 955.223 C 1198.52 1021.47 1053.83 968.602 1048.06 856.296 C 1047.6 847.398 1049.18 837.718 1050.49 828.643 z"
      />
    </motion.g>
    {/* Right eye pupil */}
    <motion.g
      animate={collapsing ? {y: 880, x: 180, rotate: 45} : {x: 0, y: 0, rotate: 0, opacity: 1}}
      transition={{duration: 0.6, ease: EASE, delay: 0.07}}
    >
      <path
        transform="translate(0,0)"
        fill="rgb(44,86,162)"
        d="M 1117.26 832.297 C 1136.32 835.116 1155.29 836.812 1174.53 839.808 C 1204.32 844.573 1233.82 851.046 1262.87 859.194 C 1258.8 866.985 1258.7 878.955 1252.34 888.566 C 1241.79 904.513 1228.19 915.171 1209.86 920.248 C 1191.04 925.513 1170.88 922.933 1153.99 913.093 C 1130.97 899.792 1118.2 877.815 1116.39 851.479 C 1116.05 846.603 1119.14 835.732 1117.26 832.297 z"
      />
    </motion.g>
    {/* Mouth/eyebrows */}
    <motion.g
      animate={collapsing ? {y: 700, x: 30, rotate: 10} : {x: 0, y: 0, rotate: 0, opacity: 1}}
      transition={{duration: 0.5, ease: EASE, delay: 0.1}}
    >
      <path
        transform="translate(0,0)"
        fill="rgb(50,55,65)"
        d="M 979.592 1009.4 C 983.343 1009.04 986.307 1008.97 990.05 1009 C 1028.85 1009.41 1065.88 1025.3 1092.91 1053.13 C 1096.96 1057.32 1104.01 1063.8 1103.94 1069.47 C 1102.72 1072.89 1102.84 1072.66 1100.03 1074.98 C 1091.26 1077.17 1084.21 1065.21 1077.91 1059.37 C 1065.75 1048.08 1053.97 1041.18 1039.06 1034.18 C 1004.13 1021 966.616 1020.38 932.678 1036.9 C 922.576 1041.82 911.475 1053.36 901.124 1051.42 C 891.065 1042.84 910.054 1032.43 915.847 1029.08 C 936.936 1016.9 955.543 1011.67 979.592 1009.4 z"
      />
    </motion.g>
  </svg>
)

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <motion.div
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{y: [0, -4, 0]}}
            transition={{duration: 0.6, repeat: Infinity, delay: 0}}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{y: [0, -4, 0]}}
            transition={{duration: 0.6, repeat: Infinity, delay: 0.15}}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{y: [0, -4, 0]}}
            transition={{duration: 0.6, repeat: Infinity, delay: 0.3}}
          />
        </div>
      </div>
    </div>
  )
}

export default function Clippy() {
  const pathname = usePathname()
  const variant = getVariant(pathname)
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleClose() {
    setCollapsed(true)
    setOpen(false)
  }

  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setOpen(true)
    }
  }, [])

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({behavior: 'smooth'})
    }
  }, [messages, loading, open])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  async function sendMessage() {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMessage: Message = {role: 'user', content: trimmed}
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/clippy', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: updatedMessages, pathname}),
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error')
        setMessages((prev) => [
          ...prev,
          {role: 'assistant', content: errorText || 'Something went wrong. Try again!'},
        ])
        return
      }

      if (!res.body) {
        setMessages((prev) => [...prev, {role: 'assistant', content: 'No response. Try again!'}])
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages((prev) => [...prev, {role: 'assistant', content: ''}])

      while (true) {
        const {value, done} = await reader.read()
        if (done) break
        assistantContent += decoder.decode(value)
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {role: 'assistant', content: assistantContent}
          return updated
        })
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `📎 I tripped over a stack trace. ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{opacity: 0, y: 20, scale: 0.95}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 20, scale: 0.95}}
            transition={{duration: 0.2, ease: 'easeOut'}}
            className="mb-3 w-[calc(100vw-1rem)] sm:w-96 max-h-[65vh] sm:max-h-[70vh] rounded-2xl shadow-2xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-700 flex flex-col relative"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close Clippy"
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            <div className="flex flex-col flex-1 min-h-0 overflow-hidden rounded-2xl">
              {/* Empty state */}
              {messages.length === 0 && (
                <div className="flex flex-col bg-purple-200 dark:bg-pink-300 items-center justify-center py-6 px-4">
                  <p className="text-xs text-gray-500 dark:text-gray-600 font-mono text-center">
                    It looks like you&apos;re browsing this website.
                    <br />I suppose I could help you...
                  </p>
                </div>
              )}

              {/* Messages */}
              {messages.length > 0 && (
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 min-h-0">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-end gap-2 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-purple-800 dark:bg-pink-500 text-white dark:text-purple-800 rounded-br-sm'
                            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && <TypingIndicator />}
                  <div ref={bottomRef} />
                </div>
              )}

              {/* Input area */}
              <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    maxLength={500}
                    disabled={loading}
                    className="flex-1 text-base sm:text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors placeholder-gray-400 disabled:opacity-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                    className="w-9 h-9 flex-shrink-0 rounded-full bg-purple-800 dark:bg-pink-200 text-white dark:text-purple-800 flex items-center justify-center hover:opacity-80 disabled:opacity-40 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => {
          if (collapsed) {
            setCollapsed(false)
            setOpen(true)
          } else if (open) {
            handleClose()
          } else {
            setOpen(true)
          }
        }}
        whileHover={collapsed ? undefined : {scale: 1.08}}
        whileTap={collapsed ? undefined : {scale: 0.95}}
        aria-label={open ? 'Close Clippy' : 'Open Clippy'}
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-30 md:h-30 lg:w-36 lg:h-36 cursor-pointer focus:outline-none"
      >
        <ClippySVG variant={variant} collapsing={collapsed} />
      </motion.button>
    </div>
  )
}
