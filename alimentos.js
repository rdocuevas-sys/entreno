/* ============================================================
   Tabla de alimentos
   ------------------------------------------------------------
   Existe porque el registro de comida pedía kcal, proteína, carbos
   y grasa escritos a mano, y ese es justamente el dato que él no
   tiene. Ahora escribe "2 huevos duros" y la app estima.

   CÓMO SE LEE CADA FILA
   - kcal, p, c, gr  ->  SIEMPRE por 100 g (o por 100 ml en líquidos).
     Los cocidos van con el valor COCIDO, porque nadie mide el arroz
     crudo después de servirlo.
   - med  ->  medidas caseras y cuántos gramos pesa cada una.
   - def  ->  la medida que se usa cuando escribe una cantidad sin
     unidad: "2 huevos" son 2 unidades, "2 arroz" no significa nada
     y por eso el arroz tiene def 'taza'.
   - alt  ->  cómo lo puede escribir. Van sin tilde y en minúscula:
     el buscador normaliza antes de comparar, así que "plátano",
     "platano" y "PLATANOS" caen en la misma fila.
   - agua ->  1 si cuenta para el total de líquido del día.

   PRECISIÓN, dicho de frente: son valores de referencia estándar y
   las porciones caseras son promedios. "Un pedazo de carne" está
   entre 80 y 250 g en el mundo real y ninguna tabla arregla eso —
   por eso cada registro se puede ajustar a mano. Para recomposición
   lo que importa es estimar SIEMPRE IGUAL, no acertar al gramo.

   Si este archivo no carga, la app sigue funcionando: el registro
   de comida queda como texto sin estimar.
   ============================================================ */
const ALIMENTOS = [

/* ---------- líquidos ---------- */
{id:'agua', n:'agua', kcal:0,p:0,c:0,gr:0, agua:1, def:'vaso',
 med:{vaso:250, litro:1000, taza:200, botella:500, ml:1},
 alt:['agua mineral','agua purificada','aguita']},
{id:'cafe', n:'café solo', kcal:2,p:0.1,c:0,gr:0, agua:1, def:'taza',
 med:{taza:200, vaso:200, ml:1}, alt:['cafe','cafe negro','cafe solo','cafecito']},
{id:'te', n:'té', kcal:1,p:0,c:0.2,gr:0, agua:1, def:'taza',
 med:{taza:200, ml:1}, alt:['te','infusion','hierba','manzanilla']},
/* Va como fila propia y no como "café" + "leche" porque el " con " parte los
   registros en dos: sin esta fila, un cortado sumaría un vaso entero de leche
   (200 ml) en vez del chorro que lleva de verdad. */
{id:'cafeleche', n:'café con leche', kcal:34,p:1.8,c:2.7,gr:1.9, agua:1, def:'taza',
 med:{taza:200, vaso:200, ml:1},
 alt:['cafe con leche','cafe cortado','cortado','te con leche','capuchino','latte']},
{id:'jugonaranja', n:'jugo de naranja', kcal:45,p:0.7,c:10,gr:0.2, agua:1, def:'vaso',
 med:{vaso:250, litro:1000, ml:1}, alt:['jugo','jugo natural','zumo de naranja']},
{id:'bebida', n:'bebida', kcal:42,p:0,c:10.6,gr:0, agua:1, def:'vaso',
 med:{vaso:250, lata:350, litro:1000, botella:500, ml:1},
 alt:['gaseosa','coca cola','coca','sprite','fanta','refresco']},
{id:'bebidazero', n:'bebida zero', kcal:0.3,p:0,c:0,gr:0, agua:1, def:'vaso',
 med:{vaso:250, lata:350, litro:1000, ml:1},
 alt:['bebida light','coca zero','coca light','gaseosa zero','zero']},
{id:'cerveza', n:'cerveza', kcal:43,p:0.5,c:3.6,gr:0, alc:3.9, agua:1, def:'lata',
 med:{lata:350, botella:330, vaso:300, ml:1}, alt:['chela','birra']},
{id:'vino', n:'vino', kcal:83,p:0.1,c:2.6,gr:0, alc:10.6, agua:1, def:'copa',
 med:{copa:150, botella:750, ml:1}, alt:['vino tinto','vino blanco','copa de vino']},
{id:'pisco', n:'pisco', kcal:221,p:0,c:0,gr:0, alc:31.6, def:'vaso',
 med:{vaso:60, ml:1}, alt:['trago','ron','vodka','whisky','destilado']},

/* ---------- lácteos ---------- */
{id:'leche', n:'leche entera', kcal:61,p:3.2,c:4.8,gr:3.3, agua:1, def:'vaso',
 med:{vaso:200, taza:200, litro:1000, ml:1}, alt:['leche']},
{id:'lechedesc', n:'leche descremada', kcal:34,p:3.4,c:5,gr:0.1, agua:1, def:'vaso',
 med:{vaso:200, taza:200, litro:1000, ml:1}, alt:['leche descremada','leche light','leche semidescremada']},
{id:'yogurt', n:'yogurt', kcal:61,p:3.5,c:4.7,gr:3.3, agua:1, def:'unidad',
 med:{unidad:125, vaso:200, ml:1}, alt:['yoghurt','yogur','yogurt natural']},
{id:'yogurtgriego', n:'yogurt griego', kcal:97,p:9,c:4,gr:5, agua:1, def:'unidad',
 med:{unidad:150, ml:1}, alt:['griego','yoghurt griego','yogur griego']},
{id:'quesomantecoso', n:'queso mantecoso', kcal:350,p:25,c:2,gr:27, def:'lamina',
 med:{lamina:20, rebanada:20}, alt:['queso','queso gauda','queso amarillo']},
{id:'quesillo', n:'quesillo', kcal:98,p:12,c:3,gr:4, def:'porcion',
 med:{porcion:100}, alt:['queso fresco','ricotta','cottage']},
{id:'mantequilla', n:'mantequilla', kcal:717,p:0.9,c:0.1,gr:81, def:'cda',
 med:{cda:14, cdta:5}, alt:['manteca']},
{id:'margarina', n:'margarina', kcal:717,p:0.2,c:0.7,gr:80, def:'cda', med:{cda:14, cdta:5}, alt:[]},
{id:'cremaleche', n:'crema', kcal:292,p:2.1,c:2.8,gr:30, def:'cda', med:{cda:15}, alt:['crema de leche','nata']},

/* ---------- huevos ---------- */
{id:'huevo', n:'huevo', kcal:143,p:12.6,c:0.7,gr:9.5, def:'unidad',
 med:{unidad:55}, alt:['huevos','huevo duro','huevos duros','huevo cocido','huevo revuelto',
                        'huevos revueltos','huevo frito','huevos fritos','huevo a la copa','omelette']},
{id:'clara', n:'clara de huevo', kcal:52,p:10.9,c:0.7,gr:0.2, def:'unidad',
 med:{unidad:33}, alt:['claras','clara','claras de huevo']},

/* ---------- carnes ---------- */
{id:'pollo', n:'pechuga de pollo', kcal:165,p:31,c:0,gr:3.6, def:'porcion',
 med:{porcion:150, unidad:150}, alt:['pollo','pechuga','pechuga de pollo','pollo a la plancha','pollo asado']},
{id:'trutro', n:'trutro de pollo', kcal:209,p:26,c:0,gr:11, def:'unidad',
 med:{unidad:90, porcion:120}, alt:['trutro','muslo','muslo de pollo','ala de pollo','trutros']},
{id:'carne', n:'carne de vacuno', kcal:217,p:30,c:0,gr:10, def:'porcion',
 med:{porcion:150, bistec:120}, alt:['carne','posta','bistec','bife','carne de vacuno','vacuno',
                                       'carne a la plancha','filete','lomo liso','asado']},
{id:'carnemolida', n:'carne molida', kcal:250,p:26,c:0,gr:16, def:'porcion',
 med:{porcion:120, taza:180}, alt:['molida','carne picada']},
{id:'cerdo', n:'cerdo', kcal:231,p:27,c:0,gr:13, def:'porcion',
 med:{porcion:150, unidad:150}, alt:['chuleta','chuleta de cerdo','costillar','lomo de cerdo']},
{id:'pavo', n:'pavo', kcal:135,p:29,c:0,gr:1, def:'porcion', med:{porcion:150}, alt:['pechuga de pavo']},
{id:'jamon', n:'jamón', kcal:145,p:18,c:1.5,gr:7, def:'lamina',
 med:{lamina:20, rebanada:20}, alt:['jamon','jamon de pavo','jamon acaramelado']},
{id:'vienesa', n:'vienesa', kcal:300,p:12,c:3,gr:27, def:'unidad',
 med:{unidad:45}, alt:['salchicha','vienesas','salchichas','hot dog sin pan']},
{id:'longaniza', n:'longaniza', kcal:330,p:15,c:2,gr:29, def:'unidad',
 med:{unidad:80}, alt:['chorizo','longanizas']},

/* ---------- pescados y mariscos ---------- */
{id:'salmon', n:'salmón', kcal:208,p:22,c:0,gr:13, def:'porcion',
 med:{porcion:140}, alt:['salmon','salmon a la plancha']},
{id:'merluza', n:'merluza', kcal:105,p:23,c:0,gr:1.3, def:'porcion',
 med:{porcion:150}, alt:['pescado','reineta','congrio','corvina']},
{id:'atun', n:'atún en agua', kcal:116,p:26,c:0,gr:1, def:'lata',
 med:{lata:120, tarro:120}, alt:['atun','atun en lata','lata de atun']},
{id:'jurel', n:'jurel en lata', kcal:150,p:20,c:0,gr:8, def:'lata',
 med:{lata:190, tarro:190}, alt:['jurel','sardinas','lata de jurel']},
{id:'camaron', n:'camarones', kcal:99,p:24,c:0.2,gr:0.3, def:'porcion',
 med:{porcion:100, taza:130}, alt:['camarones','camaron','mariscos']},

/* ---------- cereales y pastas (COCIDOS) ---------- */
{id:'arroz', n:'arroz cocido', kcal:130,p:2.7,c:28,gr:0.3, def:'taza',
 med:{taza:180, plato:250, porcion:180, cda:15}, alt:['arroz','arroz blanco','arroz graneado']},
{id:'fideos', n:'fideos cocidos', kcal:158,p:5.8,c:31,gr:0.9, def:'taza',
 med:{taza:140, plato:220, porcion:140}, alt:['fideos','pasta','tallarines','spaghetti','espagueti']},
{id:'quinoa', n:'quinoa cocida', kcal:120,p:4.4,c:21,gr:1.9, def:'taza',
 med:{taza:185, porcion:185}, alt:['quinua','quinoa']},
{id:'avena', n:'avena', kcal:389,p:16.9,c:66,gr:6.9, def:'cda',
 med:{cda:10, taza:80, porcion:40}, alt:['avena cruda','hojuelas de avena']},
{id:'cereal', n:'cereal', kcal:380,p:7,c:84,gr:1.5, def:'taza',
 med:{taza:40, porcion:40}, alt:['cereales','corn flakes','zucaritas']},
{id:'granola', n:'granola', kcal:471,p:10,c:64,gr:20, def:'taza',
 med:{taza:60, cda:12}, alt:['muesli']},

/* ---------- panes ---------- */
{id:'marraqueta', n:'marraqueta', kcal:270,p:8.5,c:55,gr:1.2, def:'unidad',
 med:{unidad:100, pedazo:50}, alt:['pan','pan batido','marraquetas','pan frances']},
{id:'hallulla', n:'hallulla', kcal:290,p:8.5,c:53,gr:4, def:'unidad',
 med:{unidad:90}, alt:['hallullas']},
{id:'panmolde', n:'pan de molde', kcal:265,p:9,c:49,gr:3.5, def:'rebanada',
 med:{rebanada:28, unidad:28}, alt:['pan de molde','pan integral','pan lacteal','tostada','tostadas']},
{id:'tortilla', n:'tortilla de rescoldo', kcal:290,p:8,c:54,gr:4, def:'unidad',
 med:{unidad:100}, alt:['tortilla','pan amasado','pan de campo']},

/* ---------- papas y tubérculos ---------- */
{id:'papa', n:'papa cocida', kcal:87,p:2,c:20,gr:0.1, def:'unidad',
 med:{unidad:150, taza:160, porcion:200}, alt:['papas','papa','papas cocidas','papa cocida']},
{id:'pure', n:'puré de papas', kcal:108,p:2,c:16,gr:4, def:'taza',
 med:{taza:210, plato:250, porcion:210}, alt:['pure','pure de papas']},
{id:'papasfritas', n:'papas fritas', kcal:312,p:3.4,c:41,gr:15, def:'porcion',
 med:{porcion:150, taza:110}, alt:['fritas','papas fritas']},
{id:'camote', n:'camote', kcal:86,p:1.6,c:20,gr:0.1, def:'unidad',
 med:{unidad:150, taza:200}, alt:['batata','boniato']},

/* ---------- legumbres (COCIDAS) ---------- */
{id:'porotos', n:'porotos cocidos', kcal:127,p:8.7,c:23,gr:0.5, def:'taza',
 med:{taza:180, plato:250, porcion:180}, alt:['porotos','frijoles','judias']},
{id:'lentejas', n:'lentejas cocidas', kcal:116,p:9,c:20,gr:0.4, def:'taza',
 med:{taza:200, plato:280, porcion:200}, alt:['lentejas','lenteja']},
{id:'garbanzos', n:'garbanzos cocidos', kcal:164,p:8.9,c:27,gr:2.6, def:'taza',
 med:{taza:165, plato:230}, alt:['garbanzos']},
{id:'arvejas', n:'arvejas', kcal:81,p:5.4,c:14,gr:0.4, def:'taza',
 med:{taza:160}, alt:['guisantes','arveja']},

/* ---------- verduras ---------- */
{id:'tomate', n:'tomate', kcal:18,p:0.9,c:3.9,gr:0.2, def:'unidad',
 med:{unidad:120, taza:180}, alt:['tomates']},
{id:'lechuga', n:'lechuga', kcal:15,p:1.4,c:2.9,gr:0.2, def:'taza',
 med:{taza:50, plato:100, porcion:80}, alt:['ensalada de lechuga','lechugas']},
{id:'ensalada', n:'ensalada', kcal:25,p:1.2,c:4.5,gr:0.3, def:'plato',
 med:{plato:150, taza:80, porcion:150}, alt:['ensalada surtida','ensalada mixta']},
{id:'zanahoria', n:'zanahoria', kcal:41,p:0.9,c:10,gr:0.2, def:'unidad',
 med:{unidad:70, taza:120}, alt:['zanahorias']},
{id:'brocoli', n:'brócoli', kcal:35,p:2.4,c:7,gr:0.4, def:'taza',
 med:{taza:90, porcion:120}, alt:['brocoli','coliflor']},
{id:'zapalloitaliano', n:'zapallo italiano', kcal:17,p:1.2,c:3.1,gr:0.3, def:'unidad',
 med:{unidad:180, taza:120}, alt:['zapallito','zucchini','calabacin']},
{id:'zapallo', n:'zapallo', kcal:26,p:1,c:6.5,gr:0.1, def:'taza',
 med:{taza:150, porcion:150}, alt:['calabaza']},
{id:'cebolla', n:'cebolla', kcal:40,p:1.1,c:9,gr:0.1, def:'unidad',
 med:{unidad:110, taza:160}, alt:['cebollas','cebolla morada']},
{id:'choclo', n:'choclo', kcal:96,p:3.4,c:21,gr:1.5, def:'taza',
 med:{taza:165, unidad:150}, alt:['maiz','elote']},
{id:'espinaca', n:'espinaca', kcal:23,p:2.9,c:3.6,gr:0.4, def:'taza',
 med:{taza:30, porcion:100}, alt:['espinacas','acelga','acelgas']},
{id:'pepino', n:'pepino', kcal:15,p:0.7,c:3.6,gr:0.1, def:'unidad', med:{unidad:150, taza:120}, alt:['pepinos']},
{id:'betarraga', n:'betarraga', kcal:43,p:1.6,c:10,gr:0.2, def:'unidad', med:{unidad:120, taza:170}, alt:['remolacha']},
{id:'champinon', n:'champiñones', kcal:22,p:3.1,c:3.3,gr:0.3, def:'taza', med:{taza:70}, alt:['champinones','hongos','setas']},
{id:'poroto_verde', n:'porotos verdes', kcal:31,p:1.8,c:7,gr:0.1, def:'taza', med:{taza:110}, alt:['porotos verdes','judias verdes']},

/* ---------- frutas ---------- */
{id:'palta', n:'palta', kcal:160,p:2,c:9,gr:15, def:'unidad',
 med:{unidad:200, cda:20, porcion:100}, alt:['aguacate','paltas']},
{id:'platano', n:'plátano', kcal:89,p:1.1,c:23,gr:0.3, def:'unidad',
 med:{unidad:120}, alt:['platano','platanos','banana']},
{id:'manzana', n:'manzana', kcal:52,p:0.3,c:14,gr:0.2, def:'unidad',
 med:{unidad:180}, alt:['manzanas']},
{id:'naranja', n:'naranja', kcal:47,p:0.9,c:12,gr:0.1, def:'unidad', med:{unidad:180}, alt:['naranjas']},
{id:'pera', n:'pera', kcal:57,p:0.4,c:15,gr:0.1, def:'unidad', med:{unidad:180}, alt:['peras']},
{id:'uva', n:'uva', kcal:69,p:0.7,c:18,gr:0.2, def:'taza', med:{taza:150, porcion:150}, alt:['uvas']},
{id:'frutilla', n:'frutillas', kcal:32,p:0.7,c:7.7,gr:0.3, def:'taza', med:{taza:150}, alt:['frutilla','fresas','berries','arandanos']},
{id:'sandia', n:'sandía', kcal:30,p:0.6,c:7.6,gr:0.2, def:'porcion', med:{porcion:280, taza:150}, alt:['sandia','melon']},
{id:'kiwi', n:'kiwi', kcal:61,p:1.1,c:15,gr:0.5, def:'unidad', med:{unidad:75}, alt:['kiwis']},
{id:'durazno', n:'durazno', kcal:39,p:0.9,c:10,gr:0.3, def:'unidad', med:{unidad:150}, alt:['duraznos','nectarin','damasco']},
{id:'limon', n:'limón', kcal:29,p:1.1,c:9,gr:0.3, def:'unidad', med:{unidad:60}, alt:['limon','limones']},

/* ---------- frutos secos y semillas ---------- */
{id:'almendra', n:'almendras', kcal:579,p:21,c:22,gr:50, def:'punado',
 med:{punado:30, taza:140, cda:9, unidad:1.2}, alt:['almendra']},
{id:'nuez', n:'nueces', kcal:654,p:15,c:14,gr:65, def:'punado',
 med:{punado:30, taza:120, unidad:5}, alt:['nuez','nueces']},
{id:'mani', n:'maní', kcal:567,p:26,c:16,gr:49, def:'punado',
 med:{punado:30, taza:145}, alt:['mani','cacahuate']},
{id:'mantequillamani', n:'mantequilla de maní', kcal:588,p:25,c:20,gr:50, def:'cda',
 med:{cda:16}, alt:['mantequilla de mani','crema de mani','peanut butter']},
{id:'chia', n:'chía', kcal:486,p:17,c:42,gr:31, def:'cda', med:{cda:12}, alt:['chia','linaza','semillas']},

/* ---------- aceites, salsas y azúcares ---------- */
{id:'aceite', n:'aceite', kcal:884,p:0,c:0,gr:100, def:'cda',
 med:{cda:14, cdta:5}, alt:['aceite de oliva','aceite vegetal','aceite de maravilla']},
{id:'mayonesa', n:'mayonesa', kcal:680,p:1,c:0.6,gr:75, def:'cda', med:{cda:15}, alt:['mayo']},
{id:'ketchup', n:'ketchup', kcal:112,p:1.2,c:26,gr:0.1, def:'cda', med:{cda:17}, alt:['catsup','salsa de tomate']},
{id:'mostaza', n:'mostaza', kcal:66,p:4,c:5,gr:3.3, def:'cda', med:{cda:15}, alt:[]},
{id:'azucar', n:'azúcar', kcal:387,p:0,c:100,gr:0, def:'cdta', med:{cdta:5, cda:12}, alt:['azucar','azucar rubia']},
{id:'miel', n:'miel', kcal:304,p:0.3,c:82,gr:0, def:'cda', med:{cda:21, cdta:7}, alt:[]},
{id:'mermelada', n:'mermelada', kcal:250,p:0.4,c:62,gr:0.1, def:'cda', med:{cda:20}, alt:['jalea']},
{id:'manjar', n:'manjar', kcal:315,p:6.8,c:55,gr:7.4, def:'cda', med:{cda:20}, alt:['dulce de leche','arequipe']},

/* ---------- suplementos ---------- */
{id:'proteina', n:'proteína en polvo', kcal:400,p:80,c:8,gr:6, def:'scoop',
 med:{scoop:30, cda:15, porcion:30}, alt:['proteina','whey','batido de proteina','shake']},
{id:'creatina', n:'creatina', kcal:0,p:0,c:0,gr:0, def:'cdta', med:{cdta:5, scoop:5}, alt:[]},

/* ---------- preparaciones y comida rápida ---------- */
{id:'empanada', n:'empanada de pino', kcal:250,p:10,c:30,gr:10, def:'unidad',
 med:{unidad:200}, alt:['empanada','empanadas','empanada de queso']},
{id:'completo', n:'completo', kcal:290,p:11,c:27,gr:15, def:'unidad',
 med:{unidad:180}, alt:['hot dog','completos','italiano']},
{id:'sopaipilla', n:'sopaipilla', kcal:350,p:5,c:40,gr:18, def:'unidad',
 med:{unidad:50}, alt:['sopaipillas']},
{id:'pizza', n:'pizza', kcal:266,p:11,c:33,gr:10, def:'trozo',
 med:{trozo:100, unidad:100, porcion:100}, alt:['pizzas']},
{id:'hamburguesa', n:'hamburguesa', kcal:250,p:15,c:20,gr:12, def:'unidad',
 med:{unidad:220}, alt:['burger','hamburguesas']},
{id:'sandwich', n:'sándwich', kcal:250,p:12,c:28,gr:10, def:'unidad',
 med:{unidad:200}, alt:['sandwich','sanguche','sandwiches','churrasco','barros luco','ave palta']},
{id:'cazuela', n:'cazuela', kcal:60,p:5,c:6,gr:2, def:'plato',
 med:{plato:450, taza:250}, alt:['caldo','sopa','consome']},
{id:'charquican', n:'charquicán', kcal:95,p:5,c:14,gr:2.5, def:'plato',
 med:{plato:350, taza:220}, alt:['charquican','guiso','estofado']},
{id:'lasana', n:'lasaña', kcal:170,p:9,c:16,gr:8, def:'porcion',
 med:{porcion:250}, alt:['lasana','canelones']},
{id:'sushi', n:'sushi', kcal:150,p:6,c:26,gr:2.5, def:'unidad',
 med:{unidad:25, porcion:250}, alt:['roll','rolls','makis']},

/* ---------- dulces ---------- */
{id:'galleta', n:'galletas', kcal:450,p:6,c:70,gr:16, def:'unidad',
 med:{unidad:8, paquete:120}, alt:['galleta','galletas de agua','soda']},
{id:'chocolate', n:'chocolate', kcal:546,p:4.9,c:61,gr:31, def:'barra',
 med:{barra:40, cuadrito:5, unidad:40}, alt:['chocolates','barra de chocolate']},
{id:'helado', n:'helado', kcal:207,p:3.5,c:24,gr:11, def:'bola',
 med:{bola:60, unidad:100, porcion:120}, alt:['helados']},
{id:'queque', n:'queque', kcal:380,p:5,c:53,gr:16, def:'porcion',
 med:{porcion:80, trozo:80}, alt:['torta','pastel','kuchen','bizcocho']},
{id:'papasfritasbolsa', n:'papas fritas de bolsa', kcal:536,p:6.6,c:53,gr:34, def:'paquete',
 med:{paquete:45, punado:20}, alt:['snack','ramitas','chizitos','papas lays']}
];

/* Sinónimos de las medidas caseras: se escriben de muchas formas y todas
   tienen que caer en la misma clave de `med`. Va sin tilde a propósito,
   porque el buscador compara después de quitar las tildes. */
const MEDIDAS = {
  unidad:['unidad','unidades','u','uds','ud'],
  taza:['taza','tazas','tz'],
  plato:['plato','platos','plato hondo'],
  vaso:['vaso','vasos'],
  litro:['litro','litros','l','lt','lts'],
  ml:['ml','mililitro','mililitros','cc'],
  g:['g','gr','gramo','gramos'],
  kg:['kg','kilo','kilos','kilogramo','kilogramos'],
  cda:['cucharada','cucharadas','cda','cdas'],
  cdta:['cucharadita','cucharaditas','cdta','cdtas'],
  rebanada:['rebanada','rebanadas','tajada','tajadas'],
  lamina:['lamina','laminas','feta','fetas'],
  pedazo:['pedazo','pedazos','trozo','trozos','cacho'],
  porcion:['porcion','porciones','plato de','racion'],
  punado:['punado','punados','manojo','pizca'],
  lata:['lata','latas','tarro','tarros'],
  botella:['botella','botellas'],
  copa:['copa','copas'],
  scoop:['scoop','scoops','medida','medidas'],
  bola:['bola','bolas'],
  trozo:['trozo','trozos'],
  barra:['barra','barras'],
  cuadrito:['cuadrito','cuadritos'],
  paquete:['paquete','paquetes','bolsa','bolsas'],
  bistec:['bistec','bistek','bife']
};

/* Cantidades escritas con palabras. "medio pollo" y "1/2 palta" tienen que
   dar lo mismo que 0,5. */
const CANTIDADES = {
  'un':1,'una':1,'uno':1,'dos':2,'tres':3,'cuatro':4,'cinco':5,'seis':6,
  'siete':7,'ocho':8,'nueve':9,'diez':10,'once':11,'doce':12,
  'medio':0.5,'media':0.5,'mitad':0.5,'cuarto':0.25,
  'par':2,'unos':1,'unas':1
};
