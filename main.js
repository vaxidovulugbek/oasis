function numMask(input, /*optional*/ mask) {
  let _mask, _oldValue,  _reDigit;

  const unMask = function (val) {
    return val.replace(/\D/g, "");
  };

  const setMask = function (val) {
    const unMaskedVal = unMask(val);
    if (unMaskedVal === "") return _mask;
    const maskArr = _mask.split("");
    let j = 0;
    maskArr.forEach(function (el, idx) {
      if (/\d|_/.test(el)) maskArr[idx] = unMaskedVal[j++] || "_";
    });
    return maskArr.join("");
  };

  const setCaretPos = function (el) {
    const val = el.value;
    const unmasked = unMask(val);
    let caretPos = 0;
    if (unmasked.length) {
      const lastDigitPos = val.search(/\d(?!.*\d)/);
      if (lastDigitPos > -1) {
        caretPos = lastDigitPos + 1;
      }
    } else {
      const nextDigitPos = val.indexOf("_");
      if (nextDigitPos > -1) caretPos = nextDigitPos;
    }
    el.setSelectionRange(caretPos, caretPos);
  };

  const onFocus = function (e) {
    const el = e.currentTarget;
    if (unMask(el.value) === "") el.value = _mask;
    setCaretPos(el);
  };

  const onKeydown = function (e) {
    const el = e.currentTarget;
    const key = e.key;
    const allowed = /^\d|Tab|Delete|Backspace|Arrow(?=Left|Right)|Right|Left|Del$/i;
    if (allowed.test(key) || (e.ctrlKey && (key === "v" || key === "V"))) {
      _oldValue = el.value;
    } else {
      e.preventDefault();
    }
  };

  const onInput = function (e) {
    let el = e.currentTarget;
    let newValue = unMask(el.value);
    if (_reDigit.test(newValue)) {
      newValue = setMask(newValue);
    } else {
      newValue = _oldValue;
    }
    el.value = newValue;
    setCaretPos(el);
  };

  const onBlur = function (e) {
    let el = e.currentTarget;
    if (unMask(el.value) === "") el.value = "";
  };

  const setRegExp = function (mask) {
    const len = (mask.match(/_/g) || []).length;
    return new RegExp("^\\d{0," + len + "}$");
  };

  if (input) {
    _mask = mask || input.dataset.mask;
    if (!_mask) return;
    _reDigit = setRegExp(_mask);
    input.maxLength = _mask.length + 1;
    input.addEventListener("focus", onFocus, false);
    input.addEventListener("keydown", onKeydown, false);
    input.addEventListener("input", onInput, false);
    input.addEventListener("blur", onBlur, false);
  }
}

document.addEventListener("DOMContentLoaded",
  function () {
    const tels = document.querySelectorAll(
      "input[type=tel][data-mask]");
    for (let i = 0, len = tels.length; i < len; i++) {
      numMask(tels[i]);
    }
    // Passing a mask as the 2nd argument.
    const cpf = document.frm1.cpf;
    numMask(cpf, "___.___.___-__");
  }
);