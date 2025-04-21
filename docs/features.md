

# Features
---
### new-channel-dialog :
	- [ ] (easy but tedious) Add option to set password (gen a random number)
	- [ ] (very easy) option to auto-connect to room

### Hand display:
	- [ ] Add toggle for card rotation (if there are a lot of cards, adds some lag when hovering)
	


### features:
	- [x] adicionar nome de quem jogou em cima da carta:
		- [x] adicionar rank
	- [x] adicionar icon para o rei da sala
	- [x] adicionar ranks na playerList
	- [x] animaçao joker
	- [x] ** dar shuffle mais vezes

	- [ ] mostrar baralhos no fim do jogo
	- [ ] se o jogador nao tiver como assistir a jogada da skip automaticamente passado x(random) segundos
		- [ ] criar uma caixinha com varias opçoes deste genero para ativar e desativar as opçoes

	(Big one)
	- [ ] adicionar stats em cada player tipo o numero de vezes que ficaram em cada posiçao
	- [ ] stats:
		- [ ] adicionar rank por pontos depois de acabar cada jogo
		- [ ] adicionar rank por carta e fazer um average para saber quem é o mais sortudo
		- [ ] adicionar valor ao baralho


	- [] (big update) fazer um modo diferente de jogar as cartas:
		- [ ] se começarem por jogar uma carta so seleciona uma

fix:
	- [x] [muito grave] quase no fim do jogo ficaram 2 players a jogar e depois os ranks bugaram quando acabou (o bug acontece porque quando alguem acaba o jogo com um joker fica com o state playing (acho eu))
	- [x] [grave] se toda a gente passar e lastPlayer n estiver definido o servidor crasha 
	- [x] (weird, need more info about it) reorganizar erro Olho.js:76
	- [x] [grave] onUserJoin reorganizar nao esta bem (testar o leaving tb)
	- [x] o som ta bugado
	- [x] fazer ultimas traduçoes que faltam
