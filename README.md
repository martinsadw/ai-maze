# AI-Maze

[Especificação](https://drive.google.com/open?id=18cAlpc3SpPWKJHYBO44nHQCTBwa9iQhh)

## Problema

### Definição

O problema abordado nesse trabalho foi encontrar um caminho que ligue uma posição marcada como entrada até uma posição marcada como saída. O labirinto é formada por uma grade quadriculada de qualquer número de dimensões, onde cada posição nessa grade pode estar preenchida ou vazia. Os movimentos que podem ser realizados para navegar por essa grade são compostos do deslocamento de no máximo uma unidade em cada uma das dimensões, sendo possível se deslocar em múltiplas dimensões simultaneamente.

O caminho que liga a entrada e a saída e deve ser composto apenas por posições dentro dos limites do labirinto, sendo que deve haver um movimento que liga quaisquer duas posições adjacentes na solução. Adicionalmente todas as posições no caminho devem ser compostas por posições vazias. O custo do caminho é igual a soma da distância euclidiana todos os pares de pontos adjacentes na solução

d = número de dimensões  
p = profundidade do caminho  

distancia(p1, p2) = sqrt(sum((p2[i] - p1[i])^2, 1, d))  
distancia_caminho(c) = sum(distancia(c[i], c[i+1]), 1, p-1)  

O labirinto é dito ter solução caso exista um caminho que ligue a entrada à saída.

### Objetivos

O objetivo do trabalho foi implementar diversos algoritmos de busca informadas e não informadas para se obter o caminho que resolva o labirinto. Os algoritmos utilizados foram:

- Métodos não informados
    - Backtracking
    - Busca em largura
    - Busca em profundidade
    - Busca ordenada
- Métodos informados
    - Busca gulosa
    - Busca A*
    - Busca IDA*

Cada algoritmo deveria produzir um conjunto de informações sobre sua execução:

- Caminho utilizado
- Profundidade do caminho
- Custo da solução
- Número total de nós expandidos
- Número total de nós visitados
- Fator de ramificação médio
- Tempo de execução

## Implementação

### Linguagem

Para a implementação dos algoritmos foi utilizado a linguagem JavaScript com o objetivo de gerar uma aplicação web para se visualizar as resolução dos labirintos de forma iterativa. Algumas bibliotecas foram utilizadas para auxiliar o desenvolvimento:

- **NumJs:** Implementação de uma matriz multidimensional
- **D3.js:** Visualização de dados
- **RequireJs:** Gerenciamento de dependências de arquivos
- **QuickSettings:** Configurações dinâmicas dentro da página
- **seedrandom:** Geração de números aleatórios utilizando seed


### Estrutura

As informações sobre os labirintos são armazenadas em uma matriz multidimensional criada pelo NumJs. Nessa matriz apenas um valor inteiro é armazenado indicando se uma posição do labirintos é vazia com o valor zero ou uma parede com o valor um.

Para obter as estatísticas de cada método foi implementado uma estrutura Statistics que armazena todos os dados necessários para obter as estatísticas desejadas. Essa estrutura é gerada como resultado da execução de cada um dos métodos de busca.

Cada algoritmo possui dois modos de execução. O modo normal executa o algoritmo completamente e gera a estrutura Statistics apenas uma vez no fim de sua execução. O modo iterativo utiliza geradores para retornar um iterador, que quando executado retorna apenas uma etapa da resolução do labirinto por vez. Uma etapa é definido por cada movimento para um novo nó exceto nos casos de backtracking aonde os retornos são desconsiderados.

Devido a necessidade de gerar resultados a cada etapa, o modo iterativo é menos eficiente que o modo normal. Além disso como o modo iterativo foi desenvolvido para suportar a visualização da resolução, apenas os labirintos bidimensionais foram considerados na implementação. Para que a visualização pudesse mostrar claramente as etapas de resolução do algoritmo dados adicionais são inseridos na estrutura de estatísticas pelo método iterativo. Por essas razões, a geração dos resultados foi realizada utilizado o modo normal de execução.

Uma estrutura para armazenar informações sobre nós foi criada para auxiliar os métodos de busca. Essa estrutura contém dados sobre qual é a posição do nó, quem é o nó pai e qual o custo para se chegar até esse nó. Os algoritmos Backtracking e IDA* criam uma lista desses nó para sua pilha de recursão. Os demais algoritmos criam listas de abertos e fechados que também são formadas por essa estrutura.

## Resultados

### Tipos de labirintos

Para se obter melhores resultados foram definidos vários tipos de geração de labirintos. Todos eles possuem um parâmetro comum que são suas dimensões, mas alguns possuem parâmetros adicionais.

#### Aberto

Esse labirinto é completamente aberto sem qualquer parede para atrapalhar a navegação. O objetivo é descobrir quais métodos de busca se saem melhor quando nenhuma restrição é imposta.

#### Parede simples

Nesse labirinto é gerado uma parede que se expande por várias posições deixando um pequeno espaço para se chegar até a solução. O objetivo é descobrir quão rápido os métodos conseguem achar essa pequena abertura para chegar à saída. As paredes são construídas de modo a ocuparem o penúltimo espaço na primeiro dimensão, se expandirem da última posição até a segunda posição na segunda dimensão, e se expandirem completamente pelas demais dimensões.

#### Zig-zag

Nesse labirinto é gerado uma série de paredes que intercalam entre permitir a passagem pela parte superior ou inferior do labirinto. O objetivo é testar a capacidade de chegar a solução quando é necessário realizar diversas curvas. As paredes são formadas de modo similar ao da Parede simples, a diferença é que as parede são posicionadas ao longo da primeira dimensão, e a abertura na parede intercala entre estar na primeira ou na última posição da segunda dimensão. As demais dimensões são expandidas completamente de modo similar. É possível passar um parâmetro informando a distância entre cada parede.

#### Desvio simples

Nesse labirinto um obstáculo cúbico é posicionado no centro de labirinto aberto. O objetivos é testar a capacidade dos métodos de contornar um obstáculo. Esse obstáculo é formada por uma parede com dimensões especificadas por um parâmetro no centro do labirinto.

#### Múltiplos caminhos

Nesse labirinto são posicionadas diversas paredes que precisam ser contornadas de modo similiar ao Zig-zag, entretanto elas são abertas em ambas as extremidades, gerando múltiplos caminhos para se chegar a saída. O objetivo é ver como os métodos lidam com múltiplos caminhos. As paredes são distribuídas pela segunda dimensão e em todas as demais dimensões deixam pequenos espaços nas duas extremidades do labirinto. É possível passar um parâmetro informando a distância entre cada parede.

#### Caminhos sem saída

Nesse labirinto são posicionadas múltiplas parede de modo similar ao Zig-zag, entretanto a extremidade aberta é sempre a superior, gerando múltiplos caminhos para serem seguidos, mas com o caminho superior sendo o único correto. O objetivo é testar a capacidade dos métodos de ignorar um caminho que não leve até a resposta. A geração desse tipo de labirinto é similar ao Zig-zag, com a única diferença sendo a posição das aberturas das parede sempre na parte inicial da segunda dimensão ao invés de intercalado. É possível passar um parâmetro informando a distância entre cada parede.

#### Caminho ruim

Nesse labirinto é criado um caminho ruim e largo que não leva até a solução. A única forma de resolver o labirinto é seguindo um caminho que se expande pela segunda dimensão e tem dimensão igual a um em todas as demais dimensões. O funcionamento desse labirinto depende da implementação da ordem de operações, mas foi feito de modo que as operações que levem ao caminho ruim sejam consideradas primeiro. O objetivo é similar ao Caminhos sem saída, mas levado a níveis mais extremos. A geração do labirinto é composta por cercar o caminho correto com paredes deixando a única abertura ao lado da entrada do labirinto.

#### Aleatório

Nesse labirinto paredes são criadas de forma aleatório. O objetivo é prover casos gerais de teste para os métodos. A geração desse labirinto constitui em percorrer todas as posições e decidir se será vazio ou uma parede através de uma probabilidade. A probabilidade de um espaço ser vazio pode ser passado por parâmetro.

### Estatísticas

Os testes foram realizados em labirintos 10x10 e 10x10x10. Os testes com labirintos aleatórios foram realizados três vezes e apenas em labirintos 10x10. Os parâmetros utilizados foram indicados nas tabelas.

#### Aberto

| Aberto (10x10) | Profundidade |    Custo    | Expandidos | Visitados | Ramificação | Tempo (ms) |
|:--------------:|:------------:|:-----------:|:----------:|:---------:|:-----------:|:----------:|
| Backtracking   |           92 | 94.72792206 |          - |         - |           - |          2 |
| Largura        |           10 | 12.72792206 |        100 |       100 |        0.99 |          3 |
| Profundidade   |           47 | 50.97056275 |         55 |       100 |         1.8 |          2 |
| Ordenada       |           10 | 12.72792206 |        100 |       100 |        0.99 |          2 |
| Guloso         |           10 | 12.72792206 |         10 |        43 |         4.3 |          0 |
| A*             |           10 | 12.72792206 |         10 |        43 |         4.3 |          0 |
| IDA*           |           10 | 12.72792206 |          - |         - |           - |          0 |

| Aberto (10x10x10) | Profundidade |    Custo    | Expandidos | Visitados | Ramificação | Tempo (ms) |
|:-----------------:|:------------:|:-----------:|:----------:|:---------:|:-----------:|:----------:|
| Backtracking      |          991 | 1072.504372 |          - |         - |           - |         91 |
| Largura           |           10 | 15.58845727 |       1000 |      1000 |       0.999 |        158 |
| Profundidade      |          186 | 230.4855724 |        259 |      1000 | 3.857142857 |         34 |
| Ordenada          |           10 | 15.58845727 |       1000 |      1000 |       0.999 |        161 |
| Guloso            |           10 | 15.58845727 |         10 |       160 |        15.9 |          1 |
| A*                |           10 | 15.58845727 |         10 |       160 |        15.9 |          1 |
| IDA*              |           10 | 15.58845727 |          - |         - |           - |          1 |

#### Parede simples

| Parede Simples (10x10) | Profundidade |    Custo    | Expandidos | Visitados | Ramificação | Tempo (ms) |
|:----------------------:|:------------:|:-----------:|:----------:|:---------:|:-----------:|:----------:|
| Backtracking           |           19 |          18 |          - |         - |           - |          1 |
| Largura                |           18 | 17.41421356 |         91 |        91 | 0.989010989 |          3 |
| Profundidade           |           18 | 17.41421356 |         19 |        27 | 1.368421053 |          0 |
| Ordenada               |           18 | 17.41421356 |         91 |        91 | 0.989010989 |          5 |
| Guloso                 |           18 | 20.72792206 |         68 |        89 | 1.294117647 |          2 |
| A*                     |           18 | 17.41421356 |         89 |        91 | 1.011235955 |          3 |
| IDA*                   |            - |           - |          - |         - |           - |          - |

| Parede Simples (10x10x10) | Profundidade |    Custo    | Expandidos | Visitados |  Ramificação | Tempo (ms) |
|:-------------------------:|:------------:|:-----------:|:----------:|:---------:|:------------:|:----------:|
| Backtracking              |            - |           - |          - |         - |            - |          - |
| Largura                   |           18 | 21.04575931 |        910 |       910 | 0.9989010989 |        126 |
| Profundidade              |          186 | 217.1733218 |        224 |       808 |  3.602678571 |         20 |
| Ordenada                  |           18 | 21.04575931 |        910 |       910 | 0.9989010989 |        133 |
| Guloso                    |           19 | 24.36699634 |        361 |       618 |  1.709141274 |         45 |
| A*                        |           18 | 21.04575931 |        832 |       882 |  1.058894231 |        138 |
| IDA*                      |            - |           - |          - |         - |            - |          - |

#### Zig-zag

| Zig-zag (10x10, 2) | Profundidade |    Custo    | Expandidos | Visitados | Ramificação | Tempo (ms) |
|:------------------:|:------------:|:-----------:|:----------:|:---------:|:-----------:|:----------:|
| Backtracking       |           55 | 62.28427125 |          - |         - |           - |          1 |
| Largura            |           29 |  31.3137085 |         65 |        66 |           1 |          1 |
| Profundidade       |           33 | 34.48528137 |         47 |        73 | 1.531914894 |          1 |
| Ordenada           |           29 |  31.3137085 |         64 |        65 |           1 |          2 |
| Guloso             |           29 |  31.3137085 |         44 |        65 | 1.454545455 |          1 |
| A*                 |           29 |  31.3137085 |         44 |        65 | 1.454545455 |          1 |
| IDA*               |            - |           - |          - |         - |           - |          - |

| Zig-zag (10x10x10, 2) | Profundidade |    Custo    | Expandidos | Visitados | Ramificação | Tempo (ms) |
|:---------------------:|:------------:|:-----------:|:----------:|:---------:|:-----------:|:----------:|
| Backtracking          |            - |           - |          - |         - |           - |          - |
| Largura               |           29 | 34.27062002 |        650 |       660 | 1.013846154 |         54 |
| Profundidade          |          196 |             |        230 |       730 | 3.169565217 |         16 |
| Ordenada              |           29 | 34.27062002 |        656 |       669 | 1.018292683 |         46 |
| Guloso                |           29 |             |        192 |       357 | 1.854166667 |         14 |
| A*                    |           29 | 34.27062002 |        541 |       594 | 1.096118299 |         40 |
| IDA*                  |            - |           - |          - |         - |           - |          - |

#### Desvio simples

| Desvio simples (10x10, 2) | Profundidade |    Custo    | Expandidos | Visitados | Ramificação | Tempo (ms) |
|:-------------------------:|:------------:|:-----------:|:----------:|:---------:|:-----------:|:----------:|
| Backtracking              |           56 | 59.55634919 |          - |         - |           - |          1 |
| Largura                   |           16 | 16.24264069 |         64 |        64 |    0.984375 |          2 |
| Profundidade              |           19 | 19.65685425 |         47 |        64 | 1.340425532 |          1 |
| Ordenada                  |           16 | 16.24264069 |         64 |        64 |    0.984375 |          1 |
| Guloso                    |           16 | 16.24264069 |         16 |        37 |        2,25 |          0 |
| A*                        |           16 | 16.24264069 |         54 |        62 |  1.12962963 |          1 |
| IDA*                      |           16 | 16.24264069 |          - |         - |           - |         89 |

| Desvio simples (10x10x10, 2) | Profundidade |    Custo    | Expandidos | Visitados |  Ramificação | Tempo (ms) |
|:----------------------------:|:------------:|:-----------:|:----------:|:---------:|:------------:|:----------:|
| Backtracking                 |          927 | 1010.161227 |          - |         - |            - |            |
| Largura                      |           16 |  19.6814338 |        784 |       784 | 0.9987244898 |         98 |
| Profundidade                 |          194 | 236.3857963 |        335 |       784 |  2.205633803 |         40 |
| Ordenada                     |           16 |  19.6814338 |        784 |       784 | 0.9987244898 |         79 |
| Guloso                       |           16 |  19.6814338 |         16 |       135 |        8.375 |          2 |
| A*                           |           16 |  19.6814338 |        576 |       772 |  1.338541667 |         65 |
| IDA*                         |            - |           - |          - |         - |            - |          - |

#### Múltiplos caminhos

| Múltiplos caminhos (10x10, 2) | Profundidade |    Custo    | Expandidos | Visitados | Ramificação | Tempo (ms) |
|:-----------------------------:|:------------:|:-----------:|:----------:|:---------:|:-----------:|:----------:|
| Backtracking                  |           82 | 87.21320344 |          - |         - |           - |          1 |
| Largura                       |           14 | 15.07106781 |         82 |        82 | 0.987804878 |          3 |
| Profundidade                  |           33 |  35.3137085 |         56 |        82 | 1.446428571 |          1 |
| Ordenada                      |           14 | 15.07106781 |         82 |        82 | 0.987804878 |          4 |
| Guloso                        |           16 | 16.24264069 |         16 |        38 |      2.3125 |          0 |
| A*                            |           14 | 15.07106781 |         51 |        66 | 1.274509804 |          1 |
| IDA*                          |           14 | 15.07106781 |          - |         - |           - |         93 |

| Múltiplos caminhos (10x10x10, 2) | Profundidade |    Custo    | Expandidos | Visitados |  Ramificação | Tempo (ms) |
|:--------------------------------:|:------------:|:-----------:|:----------:|:---------:|:------------:|:----------:|
| Backtracking                     |          882 | 965.5180236 |          - |         - |            - |         65 |
| Largura                          |           13 | 17.73132185 |        892 |       892 | 0.9988789238 |        124 |
| Profundidade                     |          179 | 212.8800641 |        221 |       856 |  3.868778281 |         20 |
| Ordenada                         |           13 | 17.73132185 |        892 |       892 | 0.9988789238 |        113 |
| Guloso                           |           13 | 17.73132185 |         13 |       135 |  10.30769231 |          1 |
| A*                               |           13 | 17.73132185 |        253 |       522 |  2.059288538 |         22 |
| IDA*                             |           13 | 17.73132185 |          - |         - |            - |      68762 |

#### Caminhos sem saída

| Caminhos sem saída (10x10, 2) | Profundidade |    Custo    | Expandidos | Visitados |  Ramificação | Tempo (ms) |
|:-----------------------------:|:------------:|:-----------:|:----------:|:---------:|:------------:|:----------:|
| Backtracking                  |            - |           - |          - |         - |            - |          - |
| Largura                       |           17 | 16.82842712 |         76 |        76 | 0.9868421053 |          3 |
| Profundidade                  |           18 | 17.41421356 |         19 |        28 |  1.421052632 |          0 |
| Ordenada                      |           17 | 16.82842712 |            |           | 0.9868421053 |          2 |
| Guloso                        |           17 | 18.48528137 |         45 |        62 |  1.355555556 |          1 |
| A*                            |           17 | 16.82842712 |         70 |        76 |  1.071428571 |          2 |
| IDA*                          |            - |           - |          - |         - |            - |          - |

| Caminhos sem saída (10x10x10, 2) | Profundidade |    Custo    | Expandidos | Visitados |  Ramificação | Tempo (ms) |
|:--------------------------------:|:------------:|:-----------:|:----------:|:---------:|:------------:|:----------:|
| Backtracking                     |            - |           - |          - |         - |            - |          - |
| Largura                          |           17 | 20.36359655 |        760 |       760 | 0.9986842105 |         70 |
| Profundidade                     |          139 |  158.796803 |        165 |       570 |  3.448484848 |         10 |
| Ordenada                         |           17 | 20.36359655 |        760 |       760 | 0.9986842105 |         63 |
| Guloso                           |           21 | 25.82769817 |        216 |       370 |  1.708333333 |         15 |
| A*                               |           17 | 20.36359655 |        605 |       724 |  1.195041322 |         55 |
| IDA*                             |            - |           - |          - |         - |            - |          - |

#### Caminho ruim

| Caminho ruim (10x10) | Profundidade |    Custo    | Expandidos | Visitados |  Ramificação | Tempo (ms) |
|:--------------------:|:------------:|:-----------:|:----------:|:---------:|:------------:|:----------:|
| Backtracking         |            - |           - |          - |         - |            - |          - |
| Largura              |           18 | 17.41421356 |         84 |        84 | 0.9880952381 |          4 |
| Profundidade         |           18 | 17.41421356 |         84 |        84 | 0.9880952381 |          4 |
| Ordenada             |           18 | 17.41421356 |         84 |        84 | 0.9880952381 |          2 |
| Guloso               |           18 | 17.41421356 |         83 |        84 |            1 |          2 |
| A*                   |           18 | 17.41421356 |         82 |        84 |            1 |          3 |
| IDA*                 |            - |           - |          - |         - |            - |          - |

| Caminho ruim (10x10x10) | Profundidade |    Custo    | Expandidos | Visitados |  Ramificação | Tempo (ms) |
|:-----------------------:|:------------:|:-----------:|:----------:|:---------:|:------------:|:----------:|
| Backtracking            |            - |           - |          - |         - |            - |          - |
| Largura                 |           18 | 21.04575931 |        656 |       656 | 0.9984756098 |         59 |
| Profundidade            |           55 | 59.38477631 |        611 |       656 |  1.072013093 |         60 |
| Ordenada                |           18 | 21.04575931 |        656 |       656 | 0.9984756098 |         54 |
| Guloso                  |           18 | 21.04575931 |        565 |       600 |  1.060176991 |         55 |
| A*                      |           18 | 21.04575931 |        552 |       600 |  1.085144928 |         53 |
| IDA*                    |            - |           - |          - |         - |            - |          - |

#### Aleatório

| Aleatorio (10x10, 0.7) | Profundidade |     Custo    |  Expandidos  |   Visitados  | Ramificação |   Tempo (ms)  |
|:----------------------:|:------------:|:------------:|:------------:|:------------:|:-----------:|:-------------:|
| Backtracking           | 55.33 (2.08) | 62.48 (3.41) |            - |            - |           - |      7 (7.81) |
| Largura                | 11.67 (0.58) |  13.7 (0.34) | 70.67 (3.21) | 70.67 (3.21) |    0.99 (0) |   1.33 (0.58) |
| Profundidade           | 21.67 (2.89) |  25.64 (3.6) | 50.33 (2.89) |    70 (2.65) | 1.37 (0.03) |   1.67 (1.53) |
| Ordenada               | 11.67 (0.58) |  13.7 (0.34) | 70.67 (3.21) | 70.67 (3.21) |    0.99 (0) |   1.33 (0.58) |
| Guloso                 |       12 (1) | 14.17 (0.76) |       12 (1) |       32 (2) |  2.6 (0.39) |   0.33 (0.58) |
| A*                     | 11.67 (0.58) |  13.7 (0.34) |    26 (5.57) |    44 (4.58) | 1.69 (0.24) |   0.67 (0.58) |
| IDA*                   | 11.67 (0.58) |  13.7 (0.34) |            - |            - |           - | 19.33 (16.07) |

### Conclusões

É possível perceber que os métodos de busca em largura, ordenada, A* e IDA* retornam a mesmo solução conforme esperado visto que são algoritmos ótimos. De um modo geral o desempenho do Backtracking e IDA* são bem inferiores aos demais, visto que são métodos que se beneficiam de um custo reduzido de memória.

Dos algoritmos ótimos o que obteve melhores resultados de tempo foi o A*. Em cenários onde a solução ótima não é necessária a busca gulosa retornou resultados bem próximos aos ótimas em diversos dos testes e obteve o melhor desempenho de um modo geral.

Alguns cuidados devem ser tomados quanto ao guloso visto que nenhum dos testes realmente explorou suas desvantagens. Um labirinto com vários caminhos longos que precisam ser contornados precisaria ser gerado para verificar a queda de qualidade do guloso. É possível perceber também que a quantidade de nós explorados está fortemente correlacionado com o tempo de execução. Dessa forma o guloso e o A* que se baseiam fortemente em explorar poucos nós se saíram melhores que os demais.

Em labirintos com caminhos incorretos muito abertos o desempenho do Backtracking e consequentemente do IDA* caíram significativamente. Isso se deve ao fato de eles tentarem explorar todas as combinações de posições antes de finalmente decidirem ir para outra direção.

Em especial o IDA* obteve péssimos resultados em labirintos com muitos desvios como o Zig-zag pois precisava de passar por diversos níveis de patamar até conseguir chegar a solução. Uma função de heurística que consiga obter valores para o nó inicial mais próximos do custo real ajudaria fortemente a diminuir seu tempo de execução.

## Dificuldades

### Multidimensão

Fazer um labirinto multidimensional faz com que várias operações simples precisem ser loops. Tanto a operação de obter a distância entre dois nó, como o simples trabalho de descobrir se uma posição do labirinto é uma parede envolvem loops percorrendo todas as dimensões. Além disso funções como a que calcula a lista de operações a partir de um nó e precisam de percorrer uma determinada região do labirinto precisam de uma recursão de loops. Nessa implementação essa recursão de loops simplificada através de uma planificação das coordenadas em um única dimensão.

cm = coordenada multidimensional  
cp = coordenada planificada  
s = dimensões do labirinto  
d = número de dimensões do labirinto

cm[i] = cp * prod(1 / s[j], 1, i-1) % s[i]  
cp = sum(cm[i] * prod(s[j], 1, i-1), 1, d)  

Além disso, a dificuldade em visualizar os resultados faz com que funcionalidades simples sejam difíceis de se compreender. Isso também dificulta a verificação para saber se os resultados realmente estão corretos.

### Visualização

Desenvolver a ferramenta de visualização dos resultados fez com que fosse necessário obter resultados parciais dos métodos. Outro problema é que nem todos os métodos geram as informações necessárias para se desenhar o processo da busca. Considerando que a visualização seria feita apenas para duas dimensões restringiu o escopo do funcionamento do modo iterativo facilitando sua implementação.

## Ideias adicionais

Devido a restrições de tempo e escopo do trabalho nem todas as ideias foram implementas. Alguns pontos para expansão desse trabalho são:

- Permitir que a visualização seja realizada passo a passo;
- Implementar mais heurísticas como a distância de Manhattan;
- Permitir que a lista de operações inclua apenas movimentos em um dimensão por vez;
- Implementar novos algoritmos de geração de labirintos, em especial um que explore as fraquezas do guloso;
- Criação dinâmica de labirintos através da ferramenta de visualização;
- Exibir resultados de estatísticas dos métodos de busca dentro da própria página;
- Obter resultados de execução dos métodos em mais casos de testes, em especial para labirintos de maiores dimensões;
- Utilizar estruturas de fila para o método de busca em largura;
- Utilizar uma lista ordenada para os métodos de busca ordenada, busca gulosa e A*.
