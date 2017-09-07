"use strict";

(function(){
	var view=(function(){
		var module={};
		module.showList=function(list, state){//передаём list(все объекты) и state(состояние приложение, в нём хранится что мы бвырали)
			//и тут смотрим если элемент подходит по всем выбранным критериям то отображаем его с помощью hiiden=false
      for(var i = 0; i < list.length; i++){
				if((list[i].dataset.type==state.type[0] || state.type[0]=='all') 
					&& (list[i].dataset.brand==state.brand[0] || state.brand[0]=='all') 
					&& (~state.check.indexOf(list[i].dataset.collection) || state.check.length==0)){
						list[i].hidden=false;
				}else{
						list[i].hidden=true;
				}
			}
		};
		module.showOption=function(value){
			var option='<option>' + value + '</option>';
			return option;
		};


		return module;
	})();

	var model=(function(){
		var module={};
		var select1=document.getElementById('selectType');
		var select2=document.getElementById('selectBrand');
		var checkBox=document.getElementById('check').getElementsByTagName('input');
		var list=document.getElementsByClassName('item');
		var state={
			check:[],
			type: ['all'],
			brand: ['all']
		};

		var loadFilter=function(){
			select1.innerHTML='<option>all</option>';
			select2.innerHTML='<option>all</option>';
			for (var i = 0; i < list.length; i++) {
				if(state.type.indexOf(list[i].dataset.type)==-1){ 
					state.type.push(list[i].dataset.type);
					select1.innerHTML+=view.showOption(list[i].dataset.type);
				}
				if(state.brand.indexOf(list[i].dataset.brand)==-1){
					state.brand.push(list[i].dataset.brand);
					select2.innerHTML+=view.showOption(list[i].dataset.brand);
				}
			}
		};
		loadFilter(); 

		module.updateFilter=function(){
			state.type[0]=select1.options[select1.selectedIndex].text;
			state.brand[0]=select2.options[select2.selectedIndex].text;
			view.showList(list, state);

			var curentOption1=state.type[0];
			var curentOption2=state.brand[0];


			var tmpСheckbox=[];
			for (var i = 0; i < list.length; i++) {
				if((list[i].dataset.type==curentOption1 || curentOption1=='all') 
					&& (list[i].dataset.brand==curentOption2 || curentOption2=='all')
					&& (!~tmpСheckbox.indexOf(list[i].dataset.collection))){
					tmpСheckbox.push(list[i].dataset.collection);
				}
			}
			for (var i = 0; i < checkBox.length; i++) { 
				if(tmpСheckbox.indexOf(checkBox[i].value)==-1){
					checkBox[i].disabled=true;
				}else{
					checkBox[i].disabled=false;
				}
			}
			//
			var coun1=0;
			var count2=0;
			for (var i = 0; i < checkBox.length; i++) {
				if(checkBox[i].checked==true){
					coun1++;
					if(checkBox[i].disabled==true){
						count2++;
					}
				}
			}

			state.type=['all'];
			state.brand=['all'];
			for (var i = 0; i < list.length; i++){
        if((list[i].dataset.type==curentOption1 || curentOption1=='all') && (state.brand.indexOf(list[i].dataset.brand)==-1) && 
          (~state.check.indexOf(list[i].dataset.collection) || state.check.length==0)){
					state.brand.push(list[i].dataset.brand);
				}
				if((list[i].dataset.brand==curentOption2 || curentOption2=='all') && (state.type.indexOf(list[i].dataset.type)==-1) && 
					(~state.check.indexOf(list[i].dataset.collection) || state.check.length==0)){
					state.type.push(list[i].dataset.type);
				}
			}
			select1.innerHTML='';
			for ( i = 0; i < state.type.length; i++) {
				select1.innerHTML+='<option>'+state.type[i]+'</option>';
				if(select1.options[i].text==curentOption1){
					var curentIndex=i;
				}
			}
			select1.selectedIndex=curentIndex;
			
			select2.innerHTML='';
			for ( i = 0; i < state.brand.length; i++) {
				select2.innerHTML+='<option>'+state.brand[i]+'</option>';
				if(select2.options[i].text==curentOption2)
					curentIndex=i;
			}
			select2.selectedIndex=curentIndex;
			///////
			if(coun1==count2 && coun1!=0){
				select2.selectedIndex=0;
				select1.selectedIndex=0;
				for (var i = 0; i < checkBox.length; i++) {
					checkBox[i].disabled=false;
					model.updateFilter(); 
				}
				view.showList(list, state);
			}

		};


		module.pushState=function(val){
			state.check.push(val);//при клике на чек добавляется этот чек в наш state.check, там храниятся выбранные
		}
		module.removeState=function(val){
			state.check.splice(state.check.indexOf(val),1);// а это удаляется из массива чеков при снятии галочки
		}

		
		return module;
	})();

	model.updateFilter();
	var form = document.getElementById('products-form');
	form.onchange=function (e) {
		if(e.target.tagName == 'SELECT' && e.target.id=='selectType'){
			model.updateFilter();
		}
		if(e.target.tagName == 'SELECT' && e.target.id=='selectBrand'){
			model.updateFilter();
		}
		if(e.target.tagName == 'INPUT' ){
			if(e.target.checked){
				model.pushState(e.target.value);
			}
			else{
				model.removeState(e.target.value);
			}
			model.updateFilter();
		}
	}
})();