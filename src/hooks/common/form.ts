import { ref, toValue } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME, REG_ONLY_DIGITS} from '@/constants/reg';
import { $t } from '@/locales';

export function useFormRules() {
  const patternRules = {
    userName: {
      pattern: REG_USER_NAME,
      message: $t('form.userName.invalid'),
      trigger: 'change'
    },
    phone: {
      pattern: REG_PHONE,
      message: $t('form.phone.invalid'),
      trigger: 'change'
    },
    pwd: {
      pattern: REG_PWD,
      message: $t('form.pwd.invalid'),
      trigger: 'change'
    },
    code: {
      pattern: REG_CODE_SIX,
      message: $t('form.code.invalid'),
      trigger: 'change'
    },
    email: {
      pattern: REG_EMAIL,
      message: $t('form.email.invalid'),
      trigger: 'change'
    }
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    userName: [createRequiredRule($t('form.userName.required')), patternRules.userName],
    phone: [createRequiredRule($t('form.phone.required')), patternRules.phone],
    pwd: [createRequiredRule($t('form.pwd.required')), patternRules.pwd],
    code: [createRequiredRule($t('form.code.required')), patternRules.code],
    email: [createRequiredRule($t('form.email.required')), patternRules.email]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }

  /** create a rule for confirming the password */
  function createConfirmPwdRule(pwd: string | Ref<string> | ComputedRef<string>) {
    const confirmPwdRule: App.Global.FormRule[] = [
      { required: true, message: $t('form.confirmPwd.required') },
      {
        asyncValidator: (rule, value) => {
          if (value.trim() !== '' && value !== toValue(pwd)) {
            return Promise.reject(rule.message);
          }
          return Promise.resolve();
        },
        message: $t('form.confirmPwd.invalid'),
        trigger: 'input'
      }
    ];
    return confirmPwdRule;
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
    createConfirmPwdRule
  };
}

export function useNaiveForm() {
  const formRef = ref<FormInst | null>(null);

  async function validate() {
    await formRef.value?.validate();
  }

  async function restoreValidation() {
    formRef.value?.restoreValidation();
  }

  return {
    formRef,
    validate,
    restoreValidation
  };
}


export function cropFormRules() {
  const patternRules = {
    cropCode: {
      pattern: REG_CODE_SIX,
      message: $t('page.farmManage.crop.form.cropCode.invalid'),
      trigger: 'change'
    }
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    cropCode: [createRequiredRule($t('page.farmManage.crop.form.cropCode.required')), patternRules.cropCode],
    orgName: [createRequiredRule($t('page.farmManage.crop.form.orgName.select'))],
    cropType: [createRequiredRule($t('page.farmManage.crop.form.type.select'))] 
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }
  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
  };
}

export function cropNaiveForm() {
  const formRef = ref<FormInst | null>(null);
 
  async function validate() {
    await formRef.value?.validate();
  }

  async function restoreValidation() {
    formRef.value?.restoreValidation();
  }

  return {
    formRef,
    validate,
    restoreValidation
  };
}


export function cropTypeFormRules() {
  const patternRules = {
    cropTypeCode: {
      pattern: REG_CODE_SIX,
      message: $t('page.farmManage.cropType.form.cropTypeCode.invalid'),
      trigger: 'change'
    }
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    cropTypeCode: [createRequiredRule($t('page.farmManage.cropType.form.cropTypeCode.required')), patternRules.cropTypeCode],
    typeName: [createRequiredRule($t('page.farmManage.cropType.form.cropTypeName'))]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }
  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
  };
}


export function landFormRules() {
  const patternRules = {
    staffNum: {
      pattern: REG_ONLY_DIGITS,
      message: $t('common.form.number'),
      trigger: 'change'
    },
    deviceNum: {
      pattern: REG_ONLY_DIGITS,
      message: $t('common.form.number'),
      trigger: 'change'
    }
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    staffNum: [ patternRules.staffNum ],
    deviceNum: [ patternRules.staffNum ]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }
  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
  };
}

export function fieldPatrolFormRules() {
  const patternRules = {

  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    farmAndLand: [createRequiredRule('请选择地块')],
    address: [createRequiredRule('请填写地址')]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }
  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
  };
}

export function SeedingGrowthRules() {
  const patternRules = {

  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }
  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
  };
}

export function OracleJobRules() {
  const patternRules = {

  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }
  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
  };
}
