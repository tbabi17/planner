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
      pr_productions: [
        {
          id: $scope.uuid(),
          production_product_name: '',
          production_product_unit: null,
          production_vol1: null,
          production_vol2: null,
          production_vol3: null,
          production_price1: null,
          production_price2: null,
          production_price3: null,
          production_income1: null,
          production_income2: null,
          production_income3: null
        }
      ],
      pr_raw_materials: [
        {
          id: $scope.uuid(),
          raw_product: '',
          raw_cost1: null,
          raw_cost2: null,
          raw_cost3: null
        }
      ],
      pr_salary_costs: [
        {
          id: $scope.uuid(),
          salary_person: '',
          salary_month1: null,
          salary_year1: null,
          salary_month2: null,
          salary_year2: null,
          salary_month3: null,
          salary_year3: null,
          salary_type: 1
        },
        {
          id: $scope.uuid(),
          salary_person: '',
          salary_month1: null,
          salary_year1: null,
          salary_month2: null,
          salary_year2: null,
          salary_month3: null,
          salary_year3: null,
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
          other_costs_cost1: null,
          other_costs_cost2: null,
          other_costs_cost3: null
        }
      ],
      pr_loan_org_name: '',
      pr_loan_amount: null,
      pr_loan_rate: null,
      pr_loan_duration: null,
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
      pr_productions: [
        {
          id: $scope.uuid(),
          production_product_name: '',
          production_product_unit: null,
          production_vol1: null,
          production_vol2: null,
          production_vol3: null,
          production_price1: null,
          production_price2: null,
          production_price3: null,
          production_income1: null,
          production_income2: null,
          production_income3: null
        }
      ],
      pr_raw_materials: [
        {
          id: $scope.uuid(),
          raw_product: '',
          raw_cost1: null,
          raw_cost2: null,
          raw_cost3: null
        }
      ],
      pr_salary_costs: [
        {
          id: $scope.uuid(),
          salary_person: '',
          salary_month1: null,
          salary_year1: null,
          salary_month2: null,
          salary_year2: null,
          salary_month3: null,
          salary_year3: null,
          salary_type: 1
        },
        {
          id: $scope.uuid(),
          salary_person: '',
          salary_month1: null,
          salary_year1: null,
          salary_month2: null,
          salary_year2: null,
          salary_month3: null,
          salary_year3: null,
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
          other_costs_cost1: null,
          other_costs_cost2: null,
          other_costs_cost3: null
        }
      ],
      pr_loan_org_name: '',
      pr_loan_amount: null,
      pr_loan_rate: null,
      pr_loan_duration: null,
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
      if (valid && !$('#form_'+current).validate()) return;

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

    $scope.go = function(item) {
        $scope.planResponse = {msg: ''};
        $scope.plan = item;
        $scope.next(1,0);
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
            $scope.moneyformat($('input[name="production_income1_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_income2_'+item.id+'"'));
            $scope.moneyformat($('input[name="production_income3_'+item.id+'"'));
          });
          $scope.plan.pr_raw_materials.forEach((item, i) => {
            $scope.moneyformat($('input[name="raw_cost1_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_cost2_'+item.id+'"'));
            $scope.moneyformat($('input[name="raw_cost3_'+item.id+'"'));
          });

          $scope.plan.pr_salary_costs.forEach((item, i) => {
              $scope.moneyformat($('input[name="salary_month1_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_month2_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_month3_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_year1_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_year2_'+item.id+'"'));
              $scope.moneyformat($('input[name="salary_year3_'+item.id+'"'));
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
      $scope.plan = $scope.temp_plan;
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
