var app = angular.module('plannerApp', []);
app.controller('plannerCtrl', function($rootScope, $scope, $http) {
    $scope.year = new Date().getFullYear();
    $scope.vm = this;
    $scope.uuid = function() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }

    $scope.durationRender = function(it) {
      var values = ['', '1 жил', '2 жил', '3 жил'];
      return values[it];
    }

    $scope.selectedArray = [];
    $scope.fieldSum = '';
    $scope.field = '';
    $scope.selectedItem = {};
    $scope.format = '';
    $scope.total = 0;
    $scope.subTitle = '';
    $scope.addDetail = function(format, array, item, field, fieldSum, title) {
      $scope.subTitle = title || '';
      $scope.format = format;
      $scope.selectedItem = item;
      $scope.fieldSum = fieldSum;
      $scope.field = field;
      if (!item[field] || item[field].length < 12) {
        item[field] = [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}];
      }
      $scope.selectedArray = item[field];
      $( "#dialog" ).dialog({
        width: 720,
        height: 360,
        top: 100,
        modal: true
      });
      $scope.total = 0;
      $scope.selectedArray.forEach(function (data) {
        if ($scope.format == 'c') {
          var v = 0.0;
          if (data.m) {
            v = parseFloat(data.m.replaceAll(',','').replace("₮",'').trim());
          }
          $scope.total += v;
        } else
          $scope.total += data.m ? data.m:0;
      });

      setTimeout(function() {
        for (var i = 0; i < 12; i++)
          $scope.moneyformat($('#field_'+i));
      }, 500);
    }
    $scope.errorMsg = '';

    $scope.validation = function(id) {
      if (id == 1) {

        if (!($scope.t2n($scope.plan.pr_budget_total) == $scope.t2n($scope.plan.pr_budget_me) + $scope.t2n($scope.plan.pr_budget_funder))) {
          $('#info_'+id).fadeIn();
          $scope.errorMsg = 'Төсвийн дүн зөрүүтэй байна !';
          return false;
        }
      }

      setTimeout(function() {
        $('#info_'+id).fadeOut();
      }, 3000);

      return true;
    }


    $scope.addDetailSal = function(array, item, field, fieldSum) {
      $scope.selectedItem = item;
      $scope.fieldSum = fieldSum;
      $scope.field = field;
      if (!item[field] || item[field].length < 12) {
        item[field] = [{c: null,a:null},{c: null,a:null},{c: null,a:null},{c: null,a:null},{c: null,a:null},{c: null,a:null},{c: null,a:null},{c: null,a:null},{c: null,a:null},{c: null,a:null},{c: null,a:null},{c: null,a:null}];
      }
      $scope.selectedArray = item[field];
      $( "#dialog_sal" ).dialog({
        width: 720,
        height: 460,
        top: 100,
        modal: true
      });
      $scope.total = 0;
      $scope.selectedArray.forEach(function (data) {
          var v = 0.0;
          if (data.a) {
            v = parseFloat(data.a.replaceAll(',','').replace("₮",'').trim())*parseInt(data.c);
          }
          $scope.total += v;
      });

      setTimeout(function() {
        for (var i = 0; i < 12; i++)
          $scope.moneyformat($('#field_a_'+i));
      }, 500);
    }

    $scope.addDetailItems = function(array, item, field, fieldSum, title) {
      $scope.sub = title;
      $scope.selectedItem = item;
      $scope.fieldSum = fieldSum;
      $scope.field = field;
      if (!item[field] || item[field].length < 1) {
        item[field] = [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}];
      }
      $scope.selectedItem = item;
      $scope.selectedArray = item[field];
      $( "#dialog_items" ).dialog({
        width: 720,
        height: 460,
        top: 100,
        modal: true
      });
      $scope.total = 0;
      $scope.selectedArray.forEach(function (data) {
        var v = 0.0;
        if (data.amt) {
          v = parseFloat(data.amt);
        }
        $scope.total += v;
      });

      setTimeout(function() {
        for (var i = 0; i < 12; i++)
          $scope.moneyformat($('#field_a_'+i));
      }, 500);
    }

    $scope.calcItems = function() {
      var total = 0;
      $scope.selectedArray.forEach(function (data) {
        var v = 0.0;
        console.log(data);
        if (data && data.amt) {
          v = parseFloat(data.amt);
        }
        total += v;
      });
      $scope.selectedItem[$scope.fieldSum] = total;

      setTimeout(function(){
        $scope.value($scope.selectedItem, 'raw_price1', 'raw_price2', 'raw_price3', 'raw_price4', 'raw_price5', 'raw_vol,raw_cost', 'pr_production_price_increment_percent', 'pr_production_sale_rate');
      }, 100);

      setTimeout(function() {
        $scope.moneyformat($('input[name="'+$scope.fieldSum+'_'+$scope.selectedItem.id+'"]'));
        $( "#dialog_items" ).dialog('close');
      }, 100);
    }

    $scope.fill = function() {
      for (var i = 1; i < $scope.selectedArray.length; i++) {
        $scope.selectedArray[i].m = $scope.selectedArray[0].m;
      };
    }

    $scope.calcSal = function() {
      var total = 0;
      var p = 0;
      $scope.selectedArray.forEach(function (data) {
          var v = 0.0;
          if (data.a) {
            v = parseFloat(data.a.replaceAll(',','').replaceAll('₮','').trim()) * parseInt(data.c);
            if (v > 0.0) p++;
          }
          total += v;
      });

      $scope.selectedItem[$scope.fieldSum] = total;
      $scope.selectedItem[$scope.fieldSum.replace('year', 'month')] = total/p;
      setTimeout(function() {
        $scope.moneyformat($('input[name="'+$scope.fieldSum+'_'+$scope.selectedItem.id+'"]'));
        $scope.moneyformat($('input[name="'+$scope.fieldSum.replace('year','month')+'_'+$scope.selectedItem.id+'"]'));
        $( "#dialog_sal" ).dialog('close');
      }, 100);
    }

    $scope.calc = function() {
      var total = 0;
      $scope.selectedArray.forEach(function (data) {
        if ($scope.format == 'c') {
          var v = 0.0;
          if (data.m) {
            v = parseFloat(data.m.replaceAll(',','').replaceAll('₮','').trim());
          }
          total += v;
        } else
          total += data.m ? data.m:0;
      });

      if ($scope.fieldSum.startsWith('raw'))
        $scope.selectedItem[$scope.fieldSum] = total;
      else
       $scope.selectedItem[$scope.fieldSum] = total * $scope.plan.pr_production_sale_rate / 100;
      setTimeout(function(){
        $scope.value($scope.selectedItem, 'production_price1', 'production_price2', 'production_price3', 'production_vol,production_income', 'pr_production_price_increment_percent', 'pr_production_sale_rate');
      }, 100);
       $( "#dialog" ).dialog('close');
    }

    $scope.t2n = function(v) {
      if (!v) return 0;
      if (!isNaN(v)) return v;
      v = v.replaceAll('₮', '');
      v = v.replaceAll(',', '');
      return parseFloat(v);
    }

    $scope.value = function(item, v1, v2, v3, v4, v5, total, percent, rate) {
      if (percent == '') return;
      $('input[name="'+v2+'_'+item.id+'"]').val($scope.t2n($('input[name="'+v1+'_'+item.id+'"]').val()) + $scope.t2n($('input[name="'+v1+'_'+item.id+'"]').val()) * ($scope.plan[percent] / 100));
      $('input[name="'+v3+'_'+item.id+'"]').val($scope.t2n($('input[name="'+v2+'_'+item.id+'"]').val()) + $scope.t2n($('input[name="'+v2+'_'+item.id+'"]').val()) * ($scope.plan[percent] / 100));
      $('input[name="'+v4+'_'+item.id+'"]').val($scope.t2n($('input[name="'+v3+'_'+item.id+'"]').val()) + $scope.t2n($('input[name="'+v3+'_'+item.id+'"]').val()) * ($scope.plan[percent] / 100));
      $('input[name="'+v5+'_'+item.id+'"]').val($scope.t2n($('input[name="'+v4+'_'+item.id+'"]').val()) + $scope.t2n($('input[name="'+v4+'_'+item.id+'"]').val()) * ($scope.plan[percent] / 100));

      item[v1] = $scope.t2n($('input[name="'+v1+'_'+item.id+'"]').val());
      item[v2] = $scope.t2n($('input[name="'+v2+'_'+item.id+'"]').val());
      item[v3] = $scope.t2n($('input[name="'+v3+'_'+item.id+'"]').val());
      item[v4] = $scope.t2n($('input[name="'+v4+'_'+item.id+'"]').val());
      item[v5] = $scope.t2n($('input[name="'+v5+'_'+item.id+'"]').val());

      item[total.split(',')[1]+'1'] = ($scope.t2n($('input[name="'+total.split(',')[0]+'1_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v1+'_'+item.id+'"]').val()));
      item[total.split(',')[1]+'2'] = ($scope.t2n($('input[name="'+total.split(',')[0]+'2_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v2+'_'+item.id+'"]').val()));
      item[total.split(',')[1]+'3'] = ($scope.t2n($('input[name="'+total.split(',')[0]+'3_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v3+'_'+item.id+'"]').val()));
      item[total.split(',')[1]+'4'] = ($scope.t2n($('input[name="'+total.split(',')[0]+'4_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v4+'_'+item.id+'"]').val()));
      item[total.split(',')[1]+'5'] = ($scope.t2n($('input[name="'+total.split(',')[0]+'5_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v5+'_'+item.id+'"]').val()));

      setTimeout(function() {
        $('input[name="'+total.split(',')[1]+'1_'+item.id+'"]').val($scope.t2n($('input[name="'+total.split(',')[0]+'1_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v1+'_'+item.id+'"]').val()));
        $('input[name="'+total.split(',')[1]+'2_'+item.id+'"]').val($scope.t2n($('input[name="'+total.split(',')[0]+'2_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v2+'_'+item.id+'"]').val()));
        $('input[name="'+total.split(',')[1]+'3_'+item.id+'"]').val($scope.t2n($('input[name="'+total.split(',')[0]+'3_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v3+'_'+item.id+'"]').val()));
        $('input[name="'+total.split(',')[1]+'4_'+item.id+'"]').val($scope.t2n($('input[name="'+total.split(',')[0]+'4_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v4+'_'+item.id+'"]').val()));
        $('input[name="'+total.split(',')[1]+'5_'+item.id+'"]').val($scope.t2n($('input[name="'+total.split(',')[0]+'5_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v5+'_'+item.id+'"]').val()));

        $scope.moneyformat($('input[name="'+v1+'_'+item.id+'"]'));
        $scope.moneyformat($('input[name="'+v2+'_'+item.id+'"]'));
        $scope.moneyformat($('input[name="'+v3+'_'+item.id+'"]'));
        $scope.moneyformat($('input[name="'+v4+'_'+item.id+'"]'));
        $scope.moneyformat($('input[name="'+v5+'_'+item.id+'"]'));
        $scope.moneyformat($('input[name="'+total.split(',')[1]+'1_'+item.id+'"]'));
        $scope.moneyformat($('input[name="'+total.split(',')[1]+'2_'+item.id+'"]'));
        $scope.moneyformat($('input[name="'+total.split(',')[1]+'3_'+item.id+'"]'));
        $scope.moneyformat($('input[name="'+total.split(',')[1]+'4_'+item.id+'"]'));
        $scope.moneyformat($('input[name="'+total.split(',')[1]+'5_'+item.id+'"]'));
      }, 100);

    }

    $scope.valueDep = function(item, v1, v2, v3, v4) {
      $('input[name="'+v3+'_'+item.id+'"]').val($scope.t2n($('input[name="'+v1+'_'+item.id+'"]').val()) * $scope.t2n($('input[name="'+v2+'_'+item.id+'"]').val()) / 100);
      $('input[name="'+v4+'_'+item.id+'"]').val($scope.t2n($('input[name="'+v3+'_'+item.id+'"]').val()) / 12);

      item[v3] = $scope.t2n($('input[name="'+v3+'_'+item.id+'"]').val());
      item[v4] = $scope.t2n($('input[name="'+v4+'_'+item.id+'"]').val());

      setTimeout(function() {
        $scope.moneyformat($('input[name="'+v3+'_'+item.id+'"]'));
        $scope.moneyformat($('input[name="'+v4+'_'+item.id+'"]'));
      }, 100);
  }

    $scope.temp_plan = {
      id: $scope.uuid(),
      pr_user: '',
      pr_name: '',
      pr_user_name: '',
      pr_fund_org: '',
      pr_duration: null,
      pr_owner_name: '',
      pr_purpose: '',
      pr_expected_result: '',
      pr_budget_total: null,
      pr_budget_funder: null,
      pr_budget_me: null,
      pr_business_detail: '',
      pr_grounds: '',
      pr_investment_plan: [
        {
          id: $scope.uuid(),
          investment_item: '',
          investment_cost: null,
          investment_date: new Date(),
          investment_detail: '',
          investment_type: 1
        },
        {
          id: $scope.uuid(),
          investment_item: '',
          investment_cost: null,
          investment_date: new Date(),
          investment_detail: '',
          investment_type: 2
        }
      ],
      pr_assets: [
        {
          id: $scope.uuid(),
          asset_item: '',
          asset_total: null,
          asset_intend: '',
          asset_evaluation: null
        }
      ],
      pr_target_market: '',
      pr_client_count: null,
      pr_competitor_count: null,
      pr_competitors: [
        {
          id: $scope.uuid(),
          competitor_name: '',
          competitor_location: '',
          competitor_percent: null,
          competitor_price: null,
          competitor_advantage: '',
          competitor_weakness: ''
        }
      ],
      pr_suppliers: [
        {
          id: $scope.uuid(),
          supplier_name: '',
          supplier_item: '',
          supplier_unit: null,
          supplier_once_qty: null,
          supplier_how_near: null,
          supplier_price: null,
          supplier_how_far_vendor: null,
          supplier_transport_cost: null
        }
      ],
      pr_local_advatange: '',
      pr_local_weakness: '',
      pr_global_opportunity: '',
      pr_global_dangerius: '',
      pr_client_survey: '',
      pr_risk_management: [
        {
          id: 1,
          risk_name: 'Үйлдвэрлэлд бэлтгэх (түүхий эд нийлүүлэгчид, үйлдвэрлэлийн байр, тоног төхөөрөмж гэх мэттэй холбоотой)',
          risk_detial: '',
          risk_against: ''
        },
        {
          id: 2,
          risk_name: 'Үйлдвэрлэл (үйлдвэрлэлийн явцад)',
          risk_detial: '',
          risk_against: ''
        },
        {
          id: 3,
          risk_name: 'Борлуулалт (түгээх суваг, худалдан авагчид г.м.)',
          risk_detial: '',
          risk_against: ''
        },
        {
          id: 4,
          risk_name: 'Санхүү(Санхүүгийн эх үүсвэр, хөрвөх чадвар, төлбөрийн чадвар г.м.)',
          risk_detial: '',
          risk_against: ''
        },
        {
          id: 5,
          risk_name: 'Зах зээл(өрсөлдөгчид, зах зээлийн нөхцөл байдал, хууль эрх зүйн асуудлууд г. м.)',
          risk_detial: '',
          risk_against: ''
        }
      ],
      pr_marketing_plan_product: '',
      pr_marketing_plan_price: null,
      pr_marketing_plan_distribution: '',
      pr_marketing_plan_reclam: '',
      pr_sales_sectors: [
        {
          id: $scope.uuid(),
          sales_point_name: '',
          sales_point_location:'',
          sales_point_income: '',
          sales_point_iscontracted: null,
          sales_point_paymenttype: null,
          sales_point_conditions: ''
        }
      ],
      pr_finance_plan_detail: '',
      pr_production_price_increment_percent: 5,
      pr_production_sale_rate: 1,
      pr_productions: [
        {
          id: $scope.uuid(),
          production_product_name: '',
          production_product_unit: null,
          production_vol1: null,
          production_vol1_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          production_vol2: null,
          production_vol2_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          production_vol3: null,
          production_vol3_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          production_vol4: null,
          production_vol4_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          production_vol5: null,
          production_vol5_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          production_price1: null,
          production_price2: null,
          production_price3: null,
          production_price4: null,
          production_price5: null,
          production_income1: null,
          production_income2: null,
          production_income3: null,
          production_income4: null,
          production_income5: null
        }
      ],
      pr_raw_materials: [
        {
          id: $scope.uuid(),
          raw_product: '',
          raw_price1: null,
          raw_price1_details: [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}],
          raw_price2: null,
          raw_price2_details: [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}],
          raw_price3: null,
          raw_price3_details: [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}],
          raw_price4: null,
          raw_price4_details: [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}],
          raw_price5: null,
          raw_price5_details: [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}],
          raw_vol1: null,
          raw_vol1_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          raw_vol2: null,
          raw_vol2_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          raw_vol3: null,
          raw_vol3_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          raw_vol4: null,
          raw_vol4_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          raw_vol5: null,
          raw_vol5_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          raw_cost1: null,
          raw_cost2: null,
          raw_cost3: null,
          raw_cost4: null,
          raw_cost5: null
        }
      ],
      pr_salary_costs: [
        {
          id: $scope.uuid(),
          salary_person: '',
          salary_month1: null,
          salary_year1_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year1: null,
          salary_month2: null,
          salary_year2_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year2: null,
          salary_month3: null,
          salary_year3_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year3: null,
          salary_month4: null,
          salary_year4_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year4: null,
          salary_month5: null,
          salary_year5_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year5: null,
          salary_type: 1
        },
        {
          id: $scope.uuid(),
          salary_person: '',
          salary_month1: null,
          salary_year1_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year1: null,
          salary_month2: null,
          salary_year2_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year2: null,
          salary_month3: null,
          salary_year3_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year3: null,
          salary_month4: null,
          salary_year4_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year4: null,
          salary_month5: null,
          salary_year5_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year5: null,
          salary_type: 2
        }
      ],
      pr_depreciation_costs: [
        {
          id: $scope.uuid(),
          depreciation_item: '',
          depreciation_total: null,
          depreciation_cost_year_percent: null,
          depreciation_cost_year: null,
          depreciation_cost_month: null,
          depreciation_type: 1
        },
        {
          id: $scope.uuid(),
          depreciation_item: '',
          depreciation_total: null,
          depreciation_cost_year_percent: null,
          depreciation_cost_year: null,
          depreciation_cost_month: null,
          depreciation_type: 2
        }
      ],
      pr_other_costs: [
        {
          id: $scope.uuid(),
          other_costs_item: '',
          other_costs1_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          other_costs_cost2: null,
          other_costs2_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          other_costs_cost3: null,
          other_costs3_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          other_costs_cost4: null,
          other_costs4_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          other_costs_cost5: null,
          other_costs5_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}]
        }
      ],
      pr_loan_org_name: '',
      pr_loan_amount: null,
      pr_loan_rate: null,
      pr_loan_duration: null,
      pr_loan_start_date: null,
      pr_loan_dates: [
        {
          id: $scope.uuid(),
          loan_date: new Date(),
          loan_day: null,
          loan_rate_amount: null,
          loan_amount: null,
          loan_balance: null
        }
      ],
      pr_status: 0,
      pr_created_date : new Date(),
      pr_updated_date: new Date()
    };

    $scope.plan = {
      id: $scope.uuid(),
      pr_user: '',
      pr_name: '',
      pr_user_name: '',
      pr_fund_org: '',
      pr_duration: null,
      pr_owner_name: '',
      pr_purpose: '',
      pr_expected_result: '',
      pr_budget_total: null,
      pr_budget_funder: null,
      pr_budget_me: null,
      pr_business_detail: '',
      pr_grounds: '',
      pr_investment_plan: [
        {
          id: $scope.uuid(),
          investment_item: '',
          investment_cost: null,
          investment_date: new Date(),
          investment_detail: '',
          investment_type: 1
        }
      ],
      pr_assets: [
        {
          id: $scope.uuid(),
          asset_item: '',
          asset_total: null,
          asset_intend: '',
          asset_evaluation: null
        }
      ],
      pr_target_market: '',
      pr_client_count: null,
      pr_competitor_count: null,
      pr_competitors: [
        {
          id: $scope.uuid(),
          competitor_name: '',
          competitor_location: '',
          competitor_percent: null,
          competitor_price: null,
          competitor_advantage: '',
          competitor_weakness: ''
        }
      ],
      pr_suppliers: [
        {
          id: $scope.uuid(),
          supplier_name: '',
          supplier_item: '',
          supplier_unit: null,
          supplier_once_qty: null,
          supplier_how_near: null,
          supplier_price: null,
          supplier_how_far_vendor: null,
          supplier_transport_cost: null
        }
      ],
      pr_local_advatange: '',
      pr_local_weakness: '',
      pr_global_opportunity: '',
      pr_global_dangerius: '',
      pr_client_survey: '',
      pr_risk_management: [
        {
          id: 1,
          risk_name: 'Үйлдвэрлэлд бэлтгэх (түүхий эд нийлүүлэгчид, үйлдвэрлэлийн байр, тоног төхөөрөмж гэх мэттэй холбоотой)',
          risk_detial: '',
          risk_against: ''
        },
        {
          id: 2,
          risk_name: 'Үйлдвэрлэл (үйлдвэрлэлийн явцад)',
          risk_detial: '',
          risk_against: ''
        },
        {
          id: 3,
          risk_name: 'Борлуулалт (түгээх суваг, худалдан авагчид г.м.)',
          risk_detial: '',
          risk_against: ''
        },
        {
          id: 4,
          risk_name: 'Санхүү(Санхүүгийн эх үүсвэр, хөрвөх чадвар, төлбөрийн чадвар г.м.)',
          risk_detial: '',
          risk_against: ''
        },
        {
          id: 5,
          risk_name: 'Зах зээл(өрсөлдөгчид, зах зээлийн нөхцөл байдал, хууль эрх зүйн асуудлууд г. м.)',
          risk_detial: '',
          risk_against: ''
        }
      ],
      pr_marketing_plan_product: '',
      pr_marketing_plan_price: null,
      pr_marketing_plan_distribution: '',
      pr_marketing_plan_reclam: '',
      pr_sales_sectors: [
        {
          id: $scope.uuid(),
          sales_point_name: '',
          sales_point_location:'',
          sales_point_income: '',
          sales_point_iscontracted: null,
          sales_point_paymenttype: null,
          sales_point_conditions: ''
        }
      ],
      pr_finance_plan_detail: '',
      pr_production_price_increment_percent: 5,
      pr_production_sale_rate: 1,
      pr_productions: [
        {
          id: $scope.uuid(),
          production_product_name: '',
          production_product_unit: null,
          production_vol1: null,
          production_vol1_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          production_vol2: null,
          production_vol2_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          production_vol3: null,
          production_vol3_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          production_vol4: null,
          production_vol4_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          production_vol5: null,
          production_vol5_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          production_price1: null,
          production_price2: null,
          production_price3: null,
          production_price4: null,
          production_price5: null,
          production_income1: null,
          production_income2: null,
          production_income3: null,
          production_income4: null,
          production_income5: null
        }
      ],
      pr_raw_materials: [
        {
          id: $scope.uuid(),
          raw_product: '',
          raw_price1: null,
          raw_price1_details: [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}],
          raw_price2: null,
          raw_price2_details: [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}],
          raw_price3: null,
          raw_price3_details: [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}],
          raw_price4: null,
          raw_price4_details: [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}],
          raw_price5: null,
          raw_price5_details: [{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null},{item: null,price:null,qty:null,amt:null}],
          raw_vol1: null,
          raw_vol1_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          raw_vol2: null,
          raw_vol2_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          raw_vol3: null,
          raw_vol3_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          raw_vol4: null,
          raw_vol4_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          raw_vol5: null,
          raw_vol5_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          raw_cost1: null,
          raw_cost2: null,
          raw_cost3: null,
          raw_cost4: null,
          raw_cost5: null
        }
      ],
      pr_salary_costs: [
        {
          id: $scope.uuid(),
          salary_person: '',
          salary_month1: null,
          salary_year1_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year1: null,
          salary_month2: null,
          salary_year2_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year2: null,
          salary_month3: null,
          salary_year3_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year3: null,
          salary_month4: null,
          salary_year4_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year4: null,
          salary_month5: null,
          salary_year5_details:[{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null},{c:null,a:null}],
          salary_year5: null,
          salary_type: 1
        }
      ],
      pr_depreciation_costs: [
        {
          id: $scope.uuid(),
          depreciation_item: '',
          depreciation_total: null,
          depreciation_cost_year_percent: null,
          depreciation_cost_year: null,
          depreciation_cost_month: null,
          depreciation_type: 1
        }
      ],
      pr_other_costs: [
        {
          id: $scope.uuid(),
          other_costs_item: '',
          other_costs1_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          other_costs_cost2: null,
          other_costs2_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          other_costs_cost3: null,
          other_costs3_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          other_costs_cost4: null,
          other_costs4_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}],
          other_costs_cost5: null,
          other_costs5_details: [{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null},{m: null}]
        }
      ],
      pr_loan_org_name: '',
      pr_loan_amount: null,
      pr_loan_rate: null,
      pr_loan_duration: null,
      pr_loan_start_date: null,
      pr_loan_dates: [
        {
          id: $scope.uuid(),
          loan_date: new Date(),
          loan_day: null,
          loan_rate_amount: null,
          loan_amount: null,
          loan_balance: null
        }
      ],
      pr_status: 0,
      pr_created_date : new Date(),
      pr_updated_date: new Date()
    };

    $scope.calcLoan = function() {
      var old = parseFloat($scope.t2n($scope.plan.pr_loan_amount));
      var tot = parseFloat($scope.t2n($scope.plan.pr_loan_amount));
      var pot = 0;
      var d = new Date($scope.plan.pr_loan_start_date).yyyymmdd();
      var olddate = new Date($scope.plan.pr_loan_start_date);
      var p = d.split('-');
      p[0] = parseInt(p[0]);
      p[1] = parseInt(p[1]);
      p[2] = parseInt(p[2]);
      var old = parseFloat($scope.t2n($scope.plan.pr_loan_amount));
      $scope.plan.pr_loan_dates = [];
      for (var i = 0; i <= $scope.plan.pr_loan_duration; i++) {
        var m = JSON.parse(JSON.stringify($scope.temp_plan['pr_loan_dates'][0]));
        m.id = $scope.uuid();
        if (i == 0) {
          m.loan_balance = old;
          m.loan_day = 0;
          m.loan_date = p[0]+'-'+(p[1] < 10 ? ('0'+p[1]) : p[1])+'-'+p[2];
        } else {
          m.loan_amount = tot / $scope.plan.pr_loan_duration;
          m.loan_balance = old -  m.loan_amount;
          p[1]++;
          if (p[1] > 12) {
            p[1] = 1;
            p[0]++;
          }
          m.loan_date = p[0]+'-'+(p[1] < 10 ? ('0'+p[1]) : p[1])+'-'+p[2];
          console.log(new Date(m.loan_date)+' '+new Date(olddate));
          m.loan_day = (new Date(m.loan_date).getTime() - new Date(olddate).getTime())/(1000*24*3600);
        }
        m.loan_rate_amount = old * parseFloat($scope.plan.pr_loan_rate) / 100 * (m.loan_day / 30);
        pot += m.loan_rate_amount;
        old = m.loan_balance;
        olddate = m.loan_date;
        $scope.plan.pr_loan_dates.push(m);
      }

      // var old = parseFloat($scope.t2n($scope.plan.pr_loan_amount));
      // for (var i = 0; i <= $scope.plan.pr_loan_duration; i++) {
      //   var m = JSON.parse(JSON.stringify($scope.temp_plan['pr_loan_dates'][0]));
      //   m.id = $scope.uuid();
      //   if (i == 0) {
      //     m.loan_balance = old;
      //   } else {
      //     m.loan_rate_amount = pot / $scope.plan.pr_loan_duration;
      //     m.loan_amount = tot / $scope.plan.pr_loan_duration;
      //     if (m.loan_amount > old) m.loan_amount = old;
      //     m.loan_balance = old -  m.loan_amount;
      //   }
      //   old = m.loan_balance;
      //
      //   $scope.plan.pr_loan_dates.push(m);
      // }

      setTimeout(function() {
        for (var i = 0; i <= $scope.plan.pr_loan_duration; i++) {
          $scope.moneyformat($('input[name="loan_balance_' + $scope.plan.pr_loan_dates[i].id + '"]'));
          $scope.moneyformat($('input[name="loan_amount_' + $scope.plan.pr_loan_dates[i].id + '"]'));
          $scope.moneyformat($('input[name="loan_rate_amount_' + $scope.plan.pr_loan_dates[i].id + '"]'));
        }
      }, 100);
    }

    $scope.wordX = function(item) {
      $scope.plan = item;
      setTimeout(function() {
          var converted = htmlDocx.asBlob($('#html').html());
          saveAs(converted, 'test.docx');
      }, 100);
    }

    $scope.deletePlan = function(item) {
      $http.delete("/doc/"+item._id, item).then(function (response) {
        $scope.planResponse = response.data;
        $scope.getdoc();
      }, function myError(response) {

      });
    }

    $scope.filterByInvestment1 = function(item) {
        return item.investment_type==1;
    }

    $scope.filterByInvestment2 = function(item) {
        return item.investment_type==2;
    }

    $scope.filterBySalaryType1 = function(item) {
        return item.salary_type==1;
    }

    $scope.filterBySalaryType2 = function(item) {
        return item.salary_type==2;
    }

    $scope.filterByDepreciationCost1 = function(item) {
        return item.depreciation_type==1;
    }

    $scope.filterByDepreciationCost2 = function(item) {
        return item.depreciation_type==2;
    }

    $scope.add_item_to_array = function(array, name, id) {
      var m = JSON.parse(JSON.stringify($scope.temp_plan[name][!id ? 0 : id]));
      m.id = $scope.uuid();
      array.push(m);
    }

    $scope.remove_item_to_array = function(array, item) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == item)
          array.splice(i, 1);
      }
    }
    $scope.cpage = 0;
    $scope.npage = 0;

    $scope.next = function(next, current, valid) {
      // || (current>0 && !$scope.validation(current))
      if ((valid && !$('#form_'+current).validate())) return;

      $('#form_'+current).fadeOut(function() {
          $('#form_'+current).hide();
          $('#form_'+next).alpha = 0;
          $('#form_'+next).fadeIn(function() {
            $scope.cpage = current;
            $scope.npage = next;
          });
      });
    }

    $scope.result = function() {
      return angular.toJson($scope.plan);
    }

    $scope.moneyformat = function(item) {
      formatCurrency(item);
      item.on({
          keyup: function() {
            formatCurrency($(this));
          },
          blur: function() {
            formatCurrency($(this), "blur");
          }
      });
    }

    $scope.sumOf = function(items, field, id) {
      var total = 0;
      items.forEach(function(data) {
        total += $scope.t2n(data[field+(id==0?'':(''+id))]);
      });

      return total;
    }

    $scope.sumOfCheck = function(items, field, value, check) {
      var total = 0;
      items.forEach(function(data) {
        if (check == '' || (data[check] && data[check].length > 0 && data[check].startsWith(value+'')))
          total += $scope.t2n(data[field]);
      });

      return total;
    }

    $scope.go = function(item) {
        $scope.planResponse = {msg: ''};
        $scope.plan = item;
        $scope.next(1,0);
        $scope.plan.pr_loan_start_date = new Date($scope.plan.pr_loan_start_date.substring(0, 10));
        setTimeout(function() {
          formatCurrency($('input[name="pr_budget_total"]'));
          formatCurrency($('input[name="pr_budget_funder"]'));
          formatCurrency($('input[name="pr_budget_me"]'));
          formatCurrency($('input[name="pr_marketing_plan_price"]'));
          formatCurrency($('input[name="pr_loan_amount"]'));

          $scope.plan.pr_investment_plan.forEach((item, i) => {
            $scope.moneyformat($('input[name="investment_cost_'+item.id+'"'));
          });

          $scope.plan.pr_assets.forEach((item, i) => {
            $scope.moneyformat($('input[name="asset_total_'+item.id+'"'));
            $scope.moneyformat($('input[name="asset_evaluation_'+item.id+'"'));
          });

          $scope.plan.pr_competitors.forEach((item, i) => {
            $scope.moneyformat($('input[name="competitor_price_'+item.id+'"'));
          });
          $scope.plan.pr_suppliers.forEach((item, i) => {
            $scope.moneyformat($('input[name="supplier_price_'+item.id+'"'));
            $scope.moneyformat($('input[name="supplier_transport_cost_'+item.id+'"'));
          });

          $scope.plan.pr_sales_sectors.forEach((item, i) => {
            $scope.moneyformat($('input[name="sales_point_income_'+item.id+'"'));
          });
          $scope.plan.pr_productions.forEach((item, i) => {
            $scope.moneyformat($('input[name="production_price1_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_price2_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_price3_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_price4_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_price5_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_income1_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_income2_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_income3_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_income4_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_income5_'+item.id+'"'));
          });
          $scope.plan.pr_raw_materials.forEach((item, i) => {
            $scope.moneyformat($('input[name="raw_price1_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_price2_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_price3_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_price4_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_price5_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_cost1_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_cost2_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_cost3_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_cost4_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_cost5_'+item.id+'"'));
          });

          $scope.plan.pr_salary_costs.forEach((item, i) => {
              $scope.moneyformat($('input[name="salary_month1_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_month2_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_month3_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_month4_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_month5_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_year1_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_year2_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_year3_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_year4_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_year5_'+item.id+'"'));
          });
          $scope.plan.pr_depreciation_costs.forEach((item, i) => {
              $scope.moneyformat($('input[name="depreciation_cost_month_'+item.id+'"'));
              $scope.moneyformat($('input[name="depreciation_cost_year_'+item.id+'"'));
              $scope.moneyformat($('input[name="depreciation_total_'+item.id+'"'));
          });
          $scope.plan.pr_other_costs.forEach((item, i) => {
              $scope.moneyformat($('input[name="other_costs_cost1_'+item.id+'"'));
              $scope.moneyformat($('input[name="other_costs_cost2_'+item.id+'"'));
              $scope.moneyformat($('input[name="other_costs_cost3_'+item.id+'"'));
              $scope.moneyformat($('input[name="other_costs_cost4_'+item.id+'"'));
              $scope.moneyformat($('input[name="other_costs_cost5_'+item.id+'"'));
          });
          $scope.plan.pr_loan_dates.forEach((item, i) => {
              $scope.moneyformat($('input[name="loan_rate_amount_'+item.id+'"'));
              $scope.moneyformat($('input[name="loan_amount_'+item.id+'"'));
              $scope.moneyformat($('input[name="loan_balance_'+item.id+'"'));
          });
        }, 500);
    }

    $scope.planResponse = {msg:''};
    $scope.planSave = function(id) {
      $http.post("/doc", $scope.plan).then(function (response) {
        $scope.planResponse = response.data;
        $scope.getdoc();
        setTimeout(function() {
            if (id) $scope.next(0, id);
            else $scope.next(0,11);
        }, 1000);
      }, function myError(response) {

      });
    }

    $scope.newPlan = function(item) {
      $scope.go($scope.temp_plan);
      $scope.plan.pr_user = $scope.signedUser.id;
      $scope.plan.pr_user_name = $scope.signedUser.name;
      $scope.next(1, 0);
    }

    $scope.planlist = [];
    $scope.getdoc = function() {
      $http({
          method : "GET",
          url : "/doc/"+$scope.signedUser.id
      }).then(function (response) {
        $('#planList').show();
        $('#signed').hide();
        $('#startBtnPlan').hide();
        $scope.planlist = response.data;
      }, function myError(response) {

      });
    }

    $scope.signedUser = {};

    $scope.onSignIn = function() {
      var user = $.cookie('jwt');
      const responsePayload = parseJwt(user);
      user = {
        id : responsePayload.sub,
        name: responsePayload.name,
        given_name: responsePayload.given_name,
        family_name: responsePayload.family_name,
        img_url: responsePayload.picture,
        email: responsePayload.email,
        isadmin: false
      };

      $http.post("/connect", user).then(function (response) {
        $scope.signedUser = response.data[0];
        $scope.getdoc();
      }, function myError(response) {

      });
    }
});

app.directive('dateFormat', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ngModelCtrl) {
      //Angular 1.3 insert a formater that force to set model to date object, otherwise throw exception.
      //Reset default angular formatters/parsers
      ngModelCtrl.$formatters.length = 0;
      ngModelCtrl.$parsers.length = 0;
    }
  };
});
